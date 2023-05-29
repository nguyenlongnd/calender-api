import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { randomUUID } from 'crypto'
import { promises as fs } from 'fs'
import { OAuth2Client } from 'google-auth-library'
import { calendar_v3, google } from 'googleapis'
import * as _ from 'lodash'
import * as path from 'path'
import { RRule } from 'rrule'
import { Logger } from 'winston'
import {
  ExceptionBadRequest,
  ExceptionForbidden,
  ExceptionNotFound,
  ExceptionUnauthorized
} from '../../exception/controlled.exception'
import { ServerError } from '../../exception/internal-error.exception'
import { DeleteType, GoogleAuthError, GoogleError, Status, UpdateType, VN, message } from '../../types'
import { date_add_milisecond, date_diff, date_sort_asc, date_substract } from '../../utils/helper'
import { CreateGoogleEventReq, GetEventReq, UpdateGoogleEventReq } from './dto'
import { User } from './types/auth.user'
import { DeleteEventReq } from './dto/detele-google-event.dto'

export type Event = calendar_v3.Schema$Event
export type Calendar = calendar_v3.Calendar

@Injectable()
export class GoogleCalendarService {
  private calendar: Calendar
  private calendarId: string
  private TOKEN_PATH: string
  private CREDENTIALS_PATH: string
  private oAuth2Client: OAuth2Client

  constructor(private configService: ConfigService, @Inject('winston') private readonly logger: Logger) {
    this.TOKEN_PATH = path.join(process.cwd(), 'token.json')
    this.CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json')
    this.calendarId = this.configService.get('GOOGLE_CALANDER_ID')
    this.oAuth2Client = new OAuth2Client(
      this.configService.get('GOOGLE_CLIENT_ID'),
      this.configService.get('GOOGLE_CLIENT_SECRET'),
      this.configService.get('GOOGLE_REDIRECT_URL')
    )
  }

  async oauth2callback(code: string) {
    try {
      const r = await this.oAuth2Client.getToken(code)
      this.oAuth2Client.setCredentials(r.tokens)
      this.calendar = google.calendar({ version: 'v3', auth: this.oAuth2Client })
      await this.saveCredentials(r.tokens)
      this.logger.info('oauth2callback() OK', r.tokens)
    } catch (error) {
      this.logger.error('oauth2callback() FAIL', error)
      throw new ServerError(error)
    }
  }

  async loadSavedCredentialsIfExist() {
    try {
      const content = await fs.readFile(this.TOKEN_PATH, 'ascii')
      return JSON.parse(content)
    } catch (error) {
      this.logger.error('loadSavedCredentialsIfExist() FAIL', error)
      return null
    }
  }

  async saveCredentials(token) {
    await fs.writeFile(this.TOKEN_PATH, JSON.stringify(token))
  }

  async authorize() {
    try {
      const savedToken = await this.loadSavedCredentialsIfExist()
      if (savedToken) {
        this.oAuth2Client.setCredentials(savedToken)
        if (savedToken.expiry_date < Date.now()) {
          const newToken = await this.oAuth2Client.refreshAccessToken()
          await this.saveCredentials(newToken.credentials)
          this.logger.info('Token expired, refreshing token', { newToken: newToken.credentials })
          this.oAuth2Client.setCredentials(newToken.credentials)
        }
        this.calendar = google.calendar({ version: 'v3', auth: this.oAuth2Client })
        return message.GOOGLE_AUTHORIZED
      }

      this.logger.info('Authorizing Google Calendar,...', { path: this.CREDENTIALS_PATH })
      const authorizeUrl = this.oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: 'https://www.googleapis.com/auth/calendar'
      })
      return authorizeUrl
    } catch (error) {
      this.logger.error('Google Calendar Authorize Fail', error)
      throw new ServerError({
        message: 'Google Calendar Authorize Fail !'
      })
    }
  }

  async googleExceptionHandler(error: any, message?: string | object): Promise<any> {
    if ([404, 410].includes(error.code)) {
      throw new ExceptionNotFound(message)
    }
    if ([403].includes(error.status)) {
      throw new ExceptionForbidden(message)
    }
    if ([400].includes(error.code || error.status)) {
      throw error
    }

    if (!this.calendar || !this.oAuth2Client) {
      throw new ExceptionUnauthorized('Unauthorized, Please re-auth with Google Calendar')
    }

    if (GoogleAuthError.includes(error.message)) {
      this.logger.error('Refresh Token invalid, Remove Token File, Try to re-auth')
      await fs.unlink(this.TOKEN_PATH)
      this.oAuth2Client = null
      this.authorize()
    }

    if (error.message === GoogleError.LIMIT_EXCEEDED) {
      throw new ExceptionBadRequest({
        message: 'Limit Exceeded'
      })
    }
    throw new ServerError(message)
  }

  async createEventsService(event: CreateGoogleEventReq, user?: User): Promise<Event> {
    try {
      await this.authorize()

      if (user?.id) {
        event.extendedProperties.creator_id = user?.id
      }

      const res = await this.calendar.events.insert({
        calendarId: this.calendarId,
        sendUpdates: 'all',
        conferenceDataVersion: 1,
        requestBody: {
          colorId: event.colorId.toString(),
          summary: event.summary,
          location: event.location,
          description: event.description,
          recurrence: event.recurrence,
          creator: event.creator,
          start: { ...event.start, timeZone: VN },
          end: { ...event.end, timeZone: VN },
          attendees: event.attendees || [],
          reminders: {
            useDefault: false,
            overrides: [{ method: 'email', minutes: 30 }]
          },
          conferenceData: event.is_new_meet && {
            createRequest: {
              conferenceSolutionKey: { type: 'hangoutsMeet' },
              requestId: randomUUID()
            }
          },
          extendedProperties: {
            private: { ...event?.extendedProperties }
          }
        }
      })

      return res.data
    } catch (error) {
      this.logger.error(error)
      return this.googleExceptionHandler(error, {
        info: 'Error: create event failed!',
        detail: error?.message
      })
    }
  }

  async getInstanceOfRecurrenceService(eventId: string): Promise<Event[]> {
    try {
      await this.authorize()
      const eventInstance = await this.calendar.events.instances({
        eventId: eventId,
        calendarId: this.calendarId
      })
      return eventInstance.data.items.sort((a, b) => {
        return date_sort_asc(
          a.originalStartTime?.date || a.originalStartTime?.dateTime,
          b.originalStartTime?.date || b.originalStartTime?.dateTime
        )
      })
    } catch (error) {
      this.logger.error('getInstanceOfRecurrenceService()', error)
      return this.googleExceptionHandler(error, 'Get instance of recurrence event failed')
    }
  }

  /**
   * @param getReq
   * @description Get all events in range time
   */
  async getEventsService(getReq: GetEventReq): Promise<Event[]> {
    try {
      const { room_id, creator_id, creator_email, candidate_id } = getReq
      await this.authorize()
      const request = {
        calendarId: this.calendarId,
        timeMin: getReq.timeMin,
        timeMax: getReq.timeMax,
        timeZone: 'Asia/Ho_Chi_Minh',
        showDeleted: false,
        singleEvents: true,
        privateExtendedProperty: [
          room_id && room_id !== 'all' && `room_id=${room_id}`,
          creator_email && `creator_email=${creator_email}`,
          candidate_id && `candidate_id=${candidate_id}`
        ].filter((e) => e)
      }

      let res = (await this.calendar.events.list(request)).data.items

      if (creator_id) {
        res = res.filter((event: Event) => {
          const isCreator = event?.extendedProperties?.private?.creator_id === creator_id
          const isAttendee = event?.extendedProperties?.private?.attendees_id?.split(',').includes(creator_id)
          if (isCreator || isAttendee) {
            return this.event(event)
          }
        })
      }

      return res.filter((event: Event) => {
        if (room_id === 'all' || getReq.candidate_id || room_id === 'null') {
          return this.event(event)
        }
        if (room_id !== 'all' && event?.extendedProperties?.private?.room_id !== 'null') {
          return this.event(event)
        }
      })
    } catch (error) {
      this.logger.error('getEventsService()', error)
      return this.googleExceptionHandler(error, 'Get events failed')
    }
  }

  async getCalendarEventByIdService(eventId: string): Promise<Event> {
    try {
      await this.authorize()
      const res = await this.calendar.events.get({
        calendarId: this.calendarId,
        eventId: eventId
      })
      return res.data
    } catch (error) {
      this.logger.error('getCalendarEventByIdService()', error)
      return this.googleExceptionHandler(error, 'Event not found')
    }
  }

  async getColorEventService() {
    try {
      await this.authorize()
      const res = await this.calendar.colors.get()
      return res.data.calendar
    } catch (error) {
      this.logger.error(error)
      return this.googleExceptionHandler(error, 'Error: get color event failed')
    }
  }

  /**
   * @param id
   * @param updateEventReq
   * @description
   * updateSingleEventService(): update a SINGLE event
   * updateAllEventService(): update ALL instances of recurring event
   * updateFollowingEventService(): update all followed instances of recurring event
   * @returns
   */
  async updateEventService(id: string, updateEventReq: UpdateGoogleEventReq): Promise<Event | Event[]> {
    try {
      await this.authorize()
      const event = await this.getCalendarEventByIdService(id)
      if (!event) {
        throw new ExceptionNotFound('Event not found')
      }

      // Copy of updateEventReq and remove some fields
      const newEvent: Event = _.omit(Object.assign({}, updateEventReq), ['extendedProperties', 'recurrence'])

      // Remove meeting
      if (updateEventReq?.is_remove_meet) {
        newEvent.conferenceData = null
        if (!event.conferenceData) {
          newEvent.conferenceData = {
            createRequest: {
              conferenceSolutionKey: {
                type: 'hangoutsMeet'
              },
              requestId: randomUUID()
            }
          }
        }
      }
      // Create new meeting
      if (updateEventReq.is_new_meet) {
        newEvent.conferenceData = {
          createRequest: {
            conferenceSolutionKey: {
              type: 'hangoutsMeet'
            },
            requestId: randomUUID()
          }
        }
      }

      // Make sure that creator_id is not changed event if User is Admin
      if (undefined !== updateEventReq.extendedProperties) {
        updateEventReq.extendedProperties.creator_id = event?.extendedProperties?.private?.creator_id
      }

      // Main Logic
      switch (updateEventReq.update_type) {
        case UpdateType.SINGLE:
          return this.updateSingleEventService(id, updateEventReq, event, newEvent)
        case UpdateType.ALL:
          return this.updateAllEventService(id, updateEventReq, event, newEvent)
        case UpdateType.FOLLOWING:
          return this.updateFollowedEventService(id, updateEventReq, event, newEvent)
      }
    } catch (error) {
      this.logger.error('updateEventService()', error)
      return this.googleExceptionHandler(error, 'Update event failed')
    }
  }

  /**
   * @param newEvent - Copy of updateEventReq and remove some fields
   * @description Update a single event
   * 1. Update basic info (info that not relate to Recurrence) of orginal Single Event.
   *    - date or dateTime:  One of them must be NULL:
   * 2. Update instance of recurring event.
   * 3. Update orignal Single Event to be a Recurring event (Add RRULE).
   * 4. Update Recurring event to be a Single Event (Remove Recurrence)
   *    - recurrence must = NULL
   */
  async updateSingleEventService(
    id: string,
    updateEventReq: UpdateGoogleEventReq,
    orginalEvent: Event,
    newEvent: Event
  ): Promise<Event> {
    try {
      await this.authorize()
      if (orginalEvent.recurrence) {
        throw new ExceptionBadRequest('This is not a Single Event. Use update_type equal ALL or FOLLOWING instead')
      }

      // 3.
      if (!orginalEvent?.recurringEventId && updateEventReq?.recurrence) {
        this.logger.info('3. Update orignal Single Event to be a Recurring event (Add RRULE)')
        newEvent.recurrence = updateEventReq.recurrence
      }

      // 4.
      if (orginalEvent?.recurringEventId && updateEventReq?.recurrence === null) {
        this.logger.info('4. Update Recurring event to be a Single Event (Remove Recurrence)')
        newEvent.recurrence = null
        newEvent.start = orginalEvent.start
        newEvent.end = orginalEvent.end
        id = id.split('_')[0]
      }

      this.logger.info('LOG', {
        ...orginalEvent,
        ...newEvent
      })
      // 1. + 2.
      const res = await this.calendar.events.patch({
        calendarId: this.calendarId,
        conferenceDataVersion: 1,
        eventId: id,
        sendNotifications: true,
        requestBody: {
          ...orginalEvent,
          ...newEvent,
          summary: `Update-${new Date().toLocaleTimeString(undefined, { timeZone: VN })}`,
          extendedProperties: {
            private: {
              ...orginalEvent?.extendedProperties?.private,
              ...updateEventReq?.extendedProperties
            }
          }
        }
      })

      return res.data
    } catch (error) {
      this.logger.error('updateSingleEventService()', error)
      return this.googleExceptionHandler(error, 'Update event failed')
    }
  }

  /**
   * @param id
   * @param updateEventReq
   * @param orginalEvent
   * @param newEvent
   * @description
   * 1. Update recurrence event - root Event (not the first instance)
   */
  async updateAllEventService(
    id: string,
    updateEventReq: UpdateGoogleEventReq,
    orginalEvent: Event,
    newEvent: Event
  ): Promise<Event> {
    try {
      await this.authorize()

      const rootId = id.split('_')[0]
      let instanceEvent: Event

      if (id.includes('_')) {
        // Not the root event
        instanceEvent = Object.assign({}, orginalEvent)
        orginalEvent = await this.getCalendarEventByIdService(rootId)
      } else {
        instanceEvent = Object.assign({}, orginalEvent)
      }

      // 1. Update recurrence event - root Event (not the first instance)
      newEvent.recurrence = updateEventReq.recurrence

      if (newEvent.start) {
        const { status, value } = date_diff(newEvent.start.dateTime, instanceEvent.start.dateTime)
        newEvent.start.dateTime = date_add_milisecond(orginalEvent.start.dateTime, value)
      }

      if (newEvent.end) {
        const { status, value } = date_diff(newEvent.end.dateTime, instanceEvent.end.dateTime)
        newEvent.end.dateTime = date_add_milisecond(orginalEvent.end.dateTime, value)
      }

      const res = await this.calendar.events.patch({
        calendarId: this.calendarId,
        conferenceDataVersion: 1,
        eventId: rootId,
        sendNotifications: true,
        requestBody: {
          ...orginalEvent,
          ...newEvent,
          summary: `Update-${new Date().toLocaleTimeString()}`,
          extendedProperties: {
            private: {
              ...orginalEvent?.extendedProperties?.private,
              ...updateEventReq?.extendedProperties
            }
          }
        }
      })
      return res.data
    } catch (error) {
      this.logger.error('updateAllEventService()', error)
      return this.googleExceptionHandler(error, 'Update event failed')
    }
  }

  /**
   * @param newEvent - Copy of updateEventReq and remove some fields
   * @description Update Followed instances of recurring event
   * 1. Check if it's is THE FIRST instance of recurring event, (don't create new recurrence event)
   *
   * 2. Update basic info of  Single Event (don't create new recurrence event) if:
   * -  Update END TIME only (end.dateTime, end.date),
   * -  Update summary, color, attendees, meeting, ...
   *
   * 3. Update instances of recurring event (not the first instance), have to CREATE new recurrence event if:
   *   - Update All day -> one day, vice versa
   *   - Update START TIME only  (start.dateTime, start.date). If no recurrence provided, add COUNT in RRULE
   *   - Update new recurrence RRULE
   */
  async updateFollowedEventService(
    id: string,
    updateEventReq: UpdateGoogleEventReq,
    originalEvent: Event,
    newEvent: Event
  ): Promise<Event | Event[]> {
    try {
      await this.authorize()
      if (!id.includes('_')) {
        throw new ExceptionBadRequest(
          'This is not a instance of Recurring Event. Use update_type equal ALL or SINGLE instead'
        )
      }

      const recurrenEvent = await this.getCalendarEventByIdService(originalEvent.recurringEventId)

      if (!recurrenEvent) {
        throw new ExceptionNotFound('Recurring Event not found')
      }

      if (updateEventReq.recurrence === null || updateEventReq.recurrence?.length === 0) {
        throw new ExceptionBadRequest(
          'Recurrence == NULL can not be used with update_type == FOLLOWING, use SINGLE instead'
        )
      }

      const instanceOfRecurringEvent = await this.getInstanceOfRecurrenceService(originalEvent.recurringEventId)

      const followedEvents = instanceOfRecurringEvent.filter((event: Event) => {
        return (
          date_sort_asc(
            event.originalStartTime.date || event.originalStartTime.dateTime,
            originalEvent.originalStartTime.date || originalEvent.originalStartTime.dateTime
          ) === 1
        )
      })

      if (!instanceOfRecurringEvent || instanceOfRecurringEvent?.length === 0) {
        throw new ExceptionNotFound('Recurring Event not found')
      }

      // 1.
      if (instanceOfRecurringEvent[0].id === originalEvent.id) {
        this.logger.info(
          '1. Check if event is the first instance of recurring event %s',
          originalEvent.recurringEventId
        )
        if (recurrenEvent) {
          const res = await this.calendar.events.patch({
            calendarId: this.calendarId,
            conferenceDataVersion: 1,
            eventId: originalEvent.recurringEventId,
            sendNotifications: true,
            requestBody: {
              ...recurrenEvent,
              ...newEvent,
              recurrence: updateEventReq?.recurrence || recurrenEvent.recurrence,
              summary: `Update-${new Date().toLocaleTimeString()}`,
              extendedProperties: {
                private: {
                  ...recurrenEvent?.extendedProperties?.private,
                  ...updateEventReq?.extendedProperties
                }
              }
            }
          })
          return res.data
        }
      }

      // 3.
      const update_status = this.isCreateRecurrenEvent(originalEvent, updateEventReq, recurrenEvent)
      if (update_status.result) {
        this.logger.info(
          '3. Update an instance of recurring event that is not the first instance, update current Rule and CREATE new one'
        )
        const currentRule = RRule.fromString(recurrenEvent.recurrence[0])
        const updatedRule = new RRule({
          ...currentRule.options,
          dtstart: null,
          count: null,
          byhour: null,
          byminute: null,
          bysecond: null,
          until: date_substract(originalEvent, 1)
        }).toString()
        await this.updateAllEventService(id, { recurrence: [updatedRule] } as UpdateGoogleEventReq, recurrenEvent, {})

        this.logger.info('Create new recurrence event')
        const newRule = new RRule({
          ...RRule.fromString(updatedRule).options,
          count: followedEvents.length,
          until: null,
          dtstart: null,
          byhour: null,
          byminute: null,
          bysecond: null
        }).toString()

        const newRecurrenceEvent: CreateGoogleEventReq = {
          recurrence: [newRule],
          ...originalEvent,
          ...updateEventReq,
          extendedProperties: {
            ...originalEvent?.extendedProperties.private
          }
        }
        return await this.createEventsService(newRecurrenceEvent)
      }

      /** 2.
       * If update request has end time !== NULL, check if it's diff from original event end time
       * True: Add amount of time diff to all followed events
       * False: Do nothing
       */
      if (!update_status.result) {
        let time_diff = 0
        delete newEvent.recurrence
        delete newEvent.start

        this.logger.info('2. Update basic info of Single Event')

        if (newEvent.end) {
          const { status, value } = date_diff(newEvent.end.dateTime, originalEvent.start.dateTime)
          if (true === status) {
            time_diff = value
          }
        }

        const promiseChain = followedEvents.map(async (event: Event, index: number) => {
          return new Promise((resolve) => {
            setTimeout(resolve, 700 * index)
          }).then(() => {
            if (Math.abs(time_diff) > 0) {
              newEvent.end.dateTime = date_add_milisecond(event.start.dateTime, time_diff)
            }
            return this.updateSingleEventService(event.id, updateEventReq, event, newEvent)
          })
        })

        return await Promise.allSettled(promiseChain)
      }
    } catch (error) {
      this.logger.error('updateFollowedEventService()', error)
      return this.googleExceptionHandler(error, 'Update followed event failed')
    }
  }

  /**
   * @param query delete TYPE
   * @description
   * 1. Delete single event
   * 2. Delete all events
   * 3. Delete this and all following events
   * -
   * @returns
   */
  async deleteEventService(eventId: string, query: DeleteEventReq): Promise<string> {
    try {
      await this.authorize()
      const event = await this.getCalendarEventByIdService(eventId)

      if (!event) {
        throw new ExceptionBadRequest('Event not found')
      }

      if (DeleteType.FOLLOWING === query.delete_type) {
        if (undefined === event.recurringEventId) {
          throw new ExceptionBadRequest('Event is not a recurrence event, use ALL or SINGLE instead')
        }
        const recurrenEvent = await this.getCalendarEventByIdService(event.recurringEventId)

        if (!recurrenEvent) {
          throw new ExceptionBadRequest('Recurrence event not found')
        }

        const currentRule = RRule.fromString(recurrenEvent.recurrence[0])
        const updatedRule = new RRule({
          ...currentRule.options,
          dtstart: null,
          count: null,
          byhour: null,
          byminute: null,
          bysecond: null,
          until: date_substract(event, 1)
        }).toString()

        await this.updateAllEventService(
          event.recurringEventId,
          { recurrence: [updatedRule] } as UpdateGoogleEventReq,
          recurrenEvent,
          {}
        )
      }

      if (DeleteType.ALL === query.delete_type) {
        if (undefined !== event.recurringEventId) {
          await this.calendar.events.delete({
            calendarId: this.calendarId,
            eventId: event.recurringEventId
          })
        } else {
          await this.calendar.events.delete({
            calendarId: this.calendarId,
            eventId: event.id
          })
        }
      }

      if (DeleteType.SINGLE === query.delete_type) {
        await this.calendar.events.delete({
          calendarId: this.calendarId,
          eventId: event.id
        })
      }
      return 'Delete event successfully'
    } catch (error) {
      this.logger.error(error)
      return this.googleExceptionHandler(error, 'Error: remove event failed')
    }
  }

  /**
   * @return {Status}
   * @description check if it's need to create new Recurrence Event if:
   * 1. New start Time
   * 2. All day event -> one day event
   * 3. One day event -> all day event
   * 4. New Recurrence
   */
  private isCreateRecurrenEvent(
    orignalEvent: Event,
    updateRequest: UpdateGoogleEventReq,
    recurrenceEvent: Event
  ): Status {
    try {
      const isNoStartTime = !updateRequest.start?.dateTime && !updateRequest.start?.date
      const isNoRecurrence = !updateRequest?.recurrence

      if (isNoStartTime && isNoRecurrence) {
        return { result: false, message: 'No need to create new recurrence event' }
      }
      // 4. New Recurrence
      const isNewRules =
        updateRequest.recurrence &&
        JSON.stringify(updateRequest.recurrence)?.split('').sort().join('') !==
          JSON.stringify(recurrenceEvent.recurrence || updateRequest.recurrence)
            ?.split('')
            .sort()
            .join('')

      if (isNewRules) {
        this.logger.info('new_recurrence')
        return { result: true, message: UpdateType.RECURRENCE }
      }

      // 2. All day event -> one day event
      const isAllDayEvent = orignalEvent.start?.dateTime && updateRequest.start?.date
      if (isAllDayEvent) return { result: true, message: UpdateType.ALLDAY }

      // 3. One day event -> all day event
      const isOneDayEvent = orignalEvent.start?.date && updateRequest.start?.dateTime
      if (isOneDayEvent) return { result: true, message: UpdateType.ONEDAY }

      // 1. New start Time
      if (updateRequest.start?.dateTime || updateRequest.start?.date) {
        const isNewStartTime = date_diff(
          orignalEvent.start.dateTime || orignalEvent.start.date,
          updateRequest.start?.dateTime || updateRequest.start?.date
        )

        if (isNewStartTime.status) {
          this.logger.info('new_start_time', isNewStartTime)
          return { result: true, message: UpdateType.START_TIME }
        }
      }

      return { result: false, message: UpdateType.NO_CREATE }
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }

  private event(event: Event): Event {
    return {
      id: event?.id,
      status: event?.status,
      summary: event?.summary,
      description: event?.description,
      location: event?.location,
      creator: event?.creator,
      organizer: event?.organizer,
      attendees: event?.attendees,
      start: event?.start,
      end: event?.end,
      recurringEventId: event?.recurringEventId,
      originalStartTime: event?.originalStartTime,
      recurrence: event?.recurrence,
      extendedProperties: event?.extendedProperties
    }
  }
}
