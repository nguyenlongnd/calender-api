/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./apps/api/src/app/app.controller.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppController = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const app_service_1 = __webpack_require__("./apps/api/src/app/app.service.ts");
const swagger_1 = __webpack_require__("@nestjs/swagger");
const utils_1 = __webpack_require__("./apps/api/src/utils/index.ts");
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    getData() {
        return this.appService.getData();
    }
};
tslib_1.__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiResponse)({
        type: utils_1.CommonReponse
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], AppController.prototype, "getData", null);
AppController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Common Response Format'),
    (0, common_1.Controller)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof app_service_1.AppService !== "undefined" && app_service_1.AppService) === "function" ? _a : Object])
], AppController);
exports.AppController = AppController;


/***/ }),

/***/ "./apps/api/src/app/app.module.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const config_1 = __webpack_require__("@nestjs/config");
const app_controller_1 = __webpack_require__("./apps/api/src/app/app.controller.ts");
const app_service_1 = __webpack_require__("./apps/api/src/app/app.service.ts");
const gcanlendar_module_1 = __webpack_require__("./apps/api/src/modules/google-calendar/gcanlendar.module.ts");
const nest_winston_1 = __webpack_require__("nest-winston");
const winston_1 = __webpack_require__("winston");
const DailyRotateFile = __webpack_require__("winston-daily-rotate-file");
const typeorm_module_1 = __webpack_require__("./apps/api/src/modules/typeorm/typeorm.module.ts");
const auth_module_1 = __webpack_require__("./apps/api/src/modules/authentication/auth.module.ts");
const room_module_1 = __webpack_require__("./apps/api/src/modules/room/room.module.ts");
const event_module_1 = __webpack_require__("./apps/api/src/modules/event/event.module.ts");
let AppModule = class AppModule {
};
AppModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env'
            }),
            // For TypeORM Postgres
            typeorm_module_1.TypeormConfigModule,
            // For Winston Logger
            nest_winston_1.WinstonModule.forRoot({
                format: winston_1.format.combine(winston_1.format.errors({ stack: true }), winston_1.format.splat(), winston_1.format.timestamp({
                    format: () => new Date().toLocaleString()
                }), winston_1.format.printf((log) => {
                    const { timestamp, level, message } = log, args = tslib_1.__rest(log, ["timestamp", "level", "message"]);
                    const ts = timestamp.slice(0, 19).replace('T', ' ');
                    return `${ts} [${level}]: ${message} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ''}`;
                })),
                transports: [
                    new winston_1.transports.Console({
                        level: 'debug',
                        handleExceptions: true
                    }),
                    new DailyRotateFile({
                        dirname: './logs/infos/',
                        filename: 'info-%DATE%.log',
                        datePattern: 'YYYY-MM-DD',
                        maxFiles: '2d',
                        maxSize: '20m',
                        zippedArchive: false,
                        level: 'info'
                    }),
                    new DailyRotateFile({
                        dirname: './logs/erros/',
                        filename: 'error-%DATE%.log',
                        datePattern: 'YYYY-MM-DD',
                        maxFiles: '2d',
                        maxSize: '20m',
                        zippedArchive: false,
                        level: 'error'
                    })
                ]
            }),
            auth_module_1.AuthModule,
            gcanlendar_module_1.GoogleCalendarModule,
            room_module_1.RoomModule,
            event_module_1.EventModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService]
    })
], AppModule);
exports.AppModule = AppModule;


/***/ }),

/***/ "./apps/api/src/app/app.service.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppService = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const winston_1 = __webpack_require__("winston");
let AppService = class AppService {
    constructor(logger) {
        this.logger = logger;
    }
    getData() {
        this.logger.info('Calendar API is running!');
        return 'Calendar API is running!';
    }
};
AppService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)('winston')),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof winston_1.Logger !== "undefined" && winston_1.Logger) === "function" ? _a : Object])
], AppService);
exports.AppService = AppService;


/***/ }),

/***/ "./apps/api/src/exception/controlled.exception.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ExceptionForbidden = exports.ExceptionUnauthorized = exports.ExceptionBadRequest = exports.ExceptionNotFound = exports.ExceptionConflict = exports.UnauthorizedException = void 0;
const common_1 = __webpack_require__("@nestjs/common");
const utils_1 = __webpack_require__("./apps/api/src/utils/index.ts");
class UnauthorizedException extends common_1.HttpException {
    constructor(msg) {
        super({ code: common_1.HttpStatus.UNAUTHORIZED, message: msg || 'Unauthorized' }, common_1.HttpStatus.UNAUTHORIZED);
    }
}
exports.UnauthorizedException = UnauthorizedException;
class ExceptionConflict extends common_1.HttpException {
    constructor(msg) {
        super((0, utils_1.response)({ code: common_1.HttpStatus.CONFLICT, message: msg || 'Already exists' }, common_1.HttpStatus.CONFLICT, 'FAIL'), common_1.HttpStatus.CONFLICT);
    }
}
exports.ExceptionConflict = ExceptionConflict;
class ExceptionNotFound extends common_1.HttpException {
    constructor(msg) {
        super((0, utils_1.response)({ message: msg || 'Not found' }, common_1.HttpStatus.NOT_FOUND, 'FAIL'), common_1.HttpStatus.NOT_FOUND);
    }
}
exports.ExceptionNotFound = ExceptionNotFound;
class ExceptionBadRequest extends common_1.HttpException {
    constructor(msg) {
        super((0, utils_1.response)({ code: common_1.HttpStatus.BAD_REQUEST, message: msg || 'Bad request' }, common_1.HttpStatus.BAD_REQUEST, 'FAIL'), common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.ExceptionBadRequest = ExceptionBadRequest;
class ExceptionUnauthorized extends common_1.HttpException {
    constructor(msg) {
        super((0, utils_1.response)({ code: common_1.HttpStatus.UNAUTHORIZED, message: msg || 'Unauthorized' }, common_1.HttpStatus.UNAUTHORIZED, 'FAIL'), common_1.HttpStatus.UNAUTHORIZED);
    }
}
exports.ExceptionUnauthorized = ExceptionUnauthorized;
class ExceptionForbidden extends common_1.HttpException {
    constructor(msg) {
        super((0, utils_1.response)({ code: common_1.HttpStatus.FORBIDDEN, message: msg || 'Forbidden' }, common_1.HttpStatus.FORBIDDEN, 'FAIL'), common_1.HttpStatus.FORBIDDEN);
    }
}
exports.ExceptionForbidden = ExceptionForbidden;


/***/ }),

/***/ "./apps/api/src/exception/customValidation.exception.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CustomeValidationPipe = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const utils_1 = __webpack_require__("./apps/api/src/utils/index.ts");
class CustomeValidationPipe extends common_1.ValidationPipe {
    transform(value, metadata) {
        const _super = Object.create(null, {
            transform: { get: () => super.transform }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                return yield _super.transform.call(this, value, metadata);
            }
            catch (error) {
                if (error instanceof common_1.BadRequestException) {
                    const errors = error.getResponse();
                    throw new common_1.BadRequestException((0, utils_1.response)(errors, 400, 'VALIDATION FAIL'));
                }
            }
        });
    }
}
exports.CustomeValidationPipe = CustomeValidationPipe;


/***/ }),

/***/ "./apps/api/src/exception/httpFilter.exception.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GlobalExceptionsFilter = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const core_1 = __webpack_require__("@nestjs/core");
let GlobalExceptionsFilter = class GlobalExceptionsFilter {
    constructor(httpAdapterHost) {
        this.httpAdapterHost = httpAdapterHost;
    }
    catch(exception, host) {
        let responseBody;
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        const httpStatus = exception instanceof common_1.HttpException ? exception.getStatus() : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        // Response for controlled exception
        if (exception instanceof common_1.HttpException) {
            responseBody = exception.getResponse();
        }
        if (401 === exception.status) {
            responseBody = {
                code: httpStatus,
                info: 'FAIL',
                message: exception.message
            };
        }
        // Response for unhandled exception
        if (httpStatus === common_1.HttpStatus.INTERNAL_SERVER_ERROR) {
            responseBody = {
                code: httpStatus,
                info: 'FAIL',
                message: exception.response || 'Internal Server Error'
            };
        }
        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }
};
GlobalExceptionsFilter = tslib_1.__decorate([
    (0, common_1.Catch)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof core_1.HttpAdapterHost !== "undefined" && core_1.HttpAdapterHost) === "function" ? _a : Object])
], GlobalExceptionsFilter);
exports.GlobalExceptionsFilter = GlobalExceptionsFilter;


/***/ }),

/***/ "./apps/api/src/exception/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./apps/api/src/exception/controlled.exception.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./apps/api/src/exception/internal-error.exception.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./apps/api/src/exception/customValidation.exception.ts"), exports);


/***/ }),

/***/ "./apps/api/src/exception/internal-error.exception.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServerError = void 0;
const common_1 = __webpack_require__("@nestjs/common");
class ServerError extends common_1.HttpException {
    constructor(msg) {
        super(msg || 'Internal Server Error', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
exports.ServerError = ServerError;


/***/ }),

/***/ "./apps/api/src/modules/authentication/auth.module.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const jwt_1 = __webpack_require__("@nestjs/jwt");
const jwt_strategy_1 = __webpack_require__("./apps/api/src/modules/authentication/strategy/jwt.strategy.ts");
let AuthModule = class AuthModule {
};
AuthModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: process.env.ACCESS_TOKEN_SECRET,
                signOptions: { expiresIn: `${process.env.ACCESS_TOKEN_TTL_IN_DAY}d` }
            })
        ],
        controllers: [],
        providers: [jwt_strategy_1.JwtStrategy]
    })
], AuthModule);
exports.AuthModule = AuthModule;


/***/ }),

/***/ "./apps/api/src/modules/authentication/guard/role.guard.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PermisionUpdate = exports.RoleGuard = exports.AuthUser = exports.Roles = exports.ROLES_KEY = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const enum_1 = __webpack_require__("./apps/api/src/types/enum.ts");
const common_2 = __webpack_require__("@nestjs/common");
const gcanlendar_service_1 = __webpack_require__("./apps/api/src/modules/google-calendar/gcanlendar.service.ts");
const exception_1 = __webpack_require__("./apps/api/src/exception/index.ts");
exports.ROLES_KEY = 'roles';
const Roles = (...roles) => (0, common_1.SetMetadata)(exports.ROLES_KEY, roles);
exports.Roles = Roles;
exports.AuthUser = (0, common_2.createParamDecorator)((data, ctx) => {
    const req = ctx.switchToHttp().getRequest();
    return req['user'];
});
const RoleGuard = (roles) => {
    class Guard {
        canActivate(context) {
            var _a;
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const request = context.switchToHttp().getRequest();
                return roles.includes((_a = request === null || request === void 0 ? void 0 : request.user) === null || _a === void 0 ? void 0 : _a.role);
            });
        }
    }
    return (0, common_1.mixin)(Guard);
};
exports.RoleGuard = RoleGuard;
const PermisionUpdate = () => {
    var _a;
    let Guard = class Guard {
        constructor(calendarService) {
            this.calendarService = calendarService;
        }
        canActivate(context) {
            var _a, _b;
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const request = context.switchToHttp().getRequest();
                if ([enum_1.Role.ADMIN, enum_1.Role.DIRECTOR, enum_1.Role.MANAGER].includes(request.user.role_name))
                    return true;
                const event = yield this.calendarService.getCalendarEventByIdService(request.params.eventId);
                if (!event)
                    throw new exception_1.ExceptionForbidden('Event not found');
                if (((_b = (_a = event === null || event === void 0 ? void 0 : event.extendedProperties) === null || _a === void 0 ? void 0 : _a.private) === null || _b === void 0 ? void 0 : _b.creator_id) === request.user.id)
                    return true;
                throw new exception_1.ExceptionForbidden('You do not have permission to update this event');
            });
        }
    };
    Guard = tslib_1.__decorate([
        (0, common_1.Injectable)(),
        tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof gcanlendar_service_1.GoogleCalendarService !== "undefined" && gcanlendar_service_1.GoogleCalendarService) === "function" ? _a : Object])
    ], Guard);
    return (0, common_1.mixin)(Guard);
};
exports.PermisionUpdate = PermisionUpdate;


/***/ }),

/***/ "./apps/api/src/modules/authentication/strategy/jwt.strategy.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const passport_1 = __webpack_require__("@nestjs/passport");
const passport_jwt_1 = __webpack_require__("passport-jwt");
const winston_1 = __webpack_require__("winston");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt') {
    constructor(logger) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromExtractors([
                (req) => {
                    return req === null || req === void 0 ? void 0 : req.cookies[process.env.TOKEN_KEY_COOKIE];
                }
            ]),
            ignoreExpiration: false,
            secretOrKey: process.env.ACCESS_TOKEN_SECRET
        });
        this.logger = logger;
    }
    validate(payload) {
        this.logger.info(this.name.toString() + 'JWT Strategy validate %s' + JSON.stringify(payload));
        return payload;
    }
};
JwtStrategy = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)('winston')),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof winston_1.Logger !== "undefined" && winston_1.Logger) === "function" ? _a : Object])
], JwtStrategy);
exports.JwtStrategy = JwtStrategy;


/***/ }),

/***/ "./apps/api/src/modules/event/event.module.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventModule = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const typeorm_1 = __webpack_require__("@nestjs/typeorm");
const typeorm_2 = __webpack_require__("./apps/api/src/modules/typeorm/index.ts");
let EventModule = class EventModule {
};
EventModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([typeorm_2.MeetingRoom, typeorm_2.UserEntity])],
        controllers: [],
        providers: [],
        exports: []
    })
], EventModule);
exports.EventModule = EventModule;


/***/ }),

/***/ "./apps/api/src/modules/google-calendar/dto/create-google-event.dto.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateGoogleEventReq = exports.Creator = exports.EventMetaData = exports.EventDate = exports.Email = void 0;
const tslib_1 = __webpack_require__("tslib");
const swagger_1 = __webpack_require__("@nestjs/swagger");
const class_transformer_1 = __webpack_require__("class-transformer");
const class_validator_1 = __webpack_require__("class-validator");
class Email {
}
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        required: true
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    tslib_1.__metadata("design:type", String)
], Email.prototype, "email", void 0);
exports.Email = Email;
class EventDate {
}
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        required: true,
        description: 'Phải có cả hai trường: dateTime và date .Một trong hai phải bằng null. <h3> date dành cho Event cả ngày. dateTime dành cho Event có giờ giấc </h3>',
        example: 'Có thể là dạng ISO: 2023-01-17T02:34:01.000Z or UTC: 2023-04-27T10:00:00+07:00 or 2023-01-17 '
    })
    // @IsDateString({
    //   message: 'dateTime must be a date string'
    // })
    ,
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], EventDate.prototype, "dateTime", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        required: true,
        description: 'Phải có cả hai trường: dateTime và date.Một trong hai phải bằng null. <h3> date dành cho Event cả ngày. dateTime dành cho Event có giờ giấc </h3>',
        example: 'Có thể là dạng ISO: 2023-01-17T02:34:01.000Z or UTC: 2023-04-27T10:00:00+07:00 or 2023-01-17'
    })
    // @IsDateString({
    //   message: 'date must be a date string'
    // })
    ,
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], EventDate.prototype, "date", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Mặc định bằng Asia/Ho_Chi_Minh',
        example: 'Asia/Ho_Chi_Minh'
    }),
    (0, class_validator_1.IsString)({
        message: 'timeZone must be a string'
    }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], EventDate.prototype, "timeZone", void 0);
exports.EventDate = EventDate;
class EventMetaData {
}
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'CALI' }),
    (0, class_validator_1.IsString)({ message: 'Room name must be a string' }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], EventMetaData.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ required: true, description: 'room_id' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'room_id is required, phỏng vấn online, room_id = "null" ' }),
    tslib_1.__metadata("design:type", String)
], EventMetaData.prototype, "room_id", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'creator_id' }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], EventMetaData.prototype, "creator_id", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'creator_email' }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], EventMetaData.prototype, "creator_email", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'attendee_ids' }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], EventMetaData.prototype, "attendees_id", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'candidate_id' }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], EventMetaData.prototype, "candidate_id", void 0);
exports.EventMetaData = EventMetaData;
class Creator {
}
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    tslib_1.__metadata("design:type", String)
], Creator.prototype, "email", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], Creator.prototype, "id", void 0);
exports.Creator = Creator;
class CreateGoogleEventReq {
}
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Không phải mã hex, colorId là số nguyên thuộc [0-11]. Gọi api: /api/calendar/color để lấy danh sách mã màu',
        example: '5'
    }),
    (0, class_validator_1.Matches)(/^([0-9]|1[01])$/, { message: 'colorId must be a number in [0-11]' }),
    tslib_1.__metadata("design:type", String)
], CreateGoogleEventReq.prototype, "colorId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ required: true, description: 'Title of Event', example: 'Event title' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Event summary is required' }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], CreateGoogleEventReq.prototype, "summary", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Description of Events abcef' }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], CreateGoogleEventReq.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Hanoi, Vietnam' }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], CreateGoogleEventReq.prototype, "location", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'abc@gmail.com' }),
    (0, class_validator_1.IsObject)({ message: 'creator must be an object' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Creator),
    (0, class_validator_1.ValidateNested)(),
    tslib_1.__metadata("design:type", Creator)
], CreateGoogleEventReq.prototype, "creator", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Recurrent of events (RRULE lib: )',
        example: '[RRULE:FREQ=DAILY;COUNT=2;UNTIL=20230117T104400Z] \n '
    }),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Array)
], CreateGoogleEventReq.prototype, "recurrence", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Attendees of events',
        example: [
            {
                email: '19020202@vnu.edu.vn'
            }
        ]
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => Email),
    (0, class_validator_1.IsArray)({
        message: 'attendees must be an array'
    }),
    (0, class_validator_1.IsObject)({
        each: true
    }) // Exclude for 2d array: [[]]
    ,
    tslib_1.__metadata("design:type", Array)
], CreateGoogleEventReq.prototype, "attendees", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        required: true,
        description: 'Phải có một trong hai trường: dateTime hoặc date. Nếu có dateTime thì sẽ không có date. Lưu ý TimeZone',
        example: {
            dateTime: '2021-08-01T09:00:00+07:00',
            timeZone: 'Asia/Ho_Chi_Minh'
        }
    }),
    (0, class_validator_1.IsNotEmptyObject)(),
    (0, class_validator_1.IsObject)(),
    (0, class_transformer_1.Type)(() => EventDate),
    (0, class_validator_1.ValidateNested)(),
    tslib_1.__metadata("design:type", EventDate)
], CreateGoogleEventReq.prototype, "start", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        required: true,
        description: 'Phải có một trong hai trường: dateTime hoặc date. Nếu có dateTime thì sẽ không có date.Lưu ý TimeZone',
        example: {
            dateTime: '2021-08-01T09:00:00+07:00',
            timeZone: 'Asia/Ho_Chi_Minh'
        }
    }),
    (0, class_validator_1.IsNotEmptyObject)(),
    (0, class_validator_1.IsObject)(),
    (0, class_transformer_1.Type)(() => EventDate),
    (0, class_validator_1.ValidateNested)(),
    tslib_1.__metadata("design:type", EventDate)
], CreateGoogleEventReq.prototype, "end", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Có tạo meeting mới không?',
        example: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], CreateGoogleEventReq.prototype, "is_new_meet", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        required: true,
        description: 'Meta của Event. Lưu ý: room_id là bắt buộc',
        example: {
            room_id: '123456789',
            room_name: '1321'
        }
    }),
    (0, class_validator_1.IsNotEmptyObject)(),
    (0, class_validator_1.IsObject)(),
    (0, class_transformer_1.Type)(() => EventMetaData),
    (0, class_validator_1.ValidateNested)(),
    tslib_1.__metadata("design:type", EventMetaData)
], CreateGoogleEventReq.prototype, "extendedProperties", void 0);
exports.CreateGoogleEventReq = CreateGoogleEventReq;


/***/ }),

/***/ "./apps/api/src/modules/google-calendar/dto/detele-google-event.dto.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DeleteEventReq = void 0;
const tslib_1 = __webpack_require__("tslib");
const swagger_1 = __webpack_require__("@nestjs/swagger");
const class_validator_1 = __webpack_require__("class-validator");
class DeleteEventReq {
}
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        required: true,
        description: 'Update type: single, all, following'
    }),
    (0, class_validator_1.IsEnum)(['single', 'all', 'following'], {
        message: 'update_type must be a string in [single, all, following]'
    }),
    tslib_1.__metadata("design:type", String)
], DeleteEventReq.prototype, "delete_type", void 0);
exports.DeleteEventReq = DeleteEventReq;


/***/ }),

/***/ "./apps/api/src/modules/google-calendar/dto/get-google-events.dto.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetEventReq = void 0;
const tslib_1 = __webpack_require__("tslib");
const swagger_1 = __webpack_require__("@nestjs/swagger");
const class_validator_1 = __webpack_require__("class-validator");
const moment = __webpack_require__("moment-timezone");
class GetEventReq {
}
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'timeMin',
        example: `<div>import * as moment from 'moment-timezone'</div> <br> moment().add(3, 'days').startOf('day').tz('Asia/Ho_Chi_Minh').format() \n <div> ${moment()
            .add(0, 'days')
            .startOf('day')
            .tz('Asia/Ho_Chi_Minh')
            .format()}
      </div> `
    }),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], GetEventReq.prototype, "timeMin", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'timeMax',
        example: `<div>import * as moment from 'moment-timezone'</div> <br> moment().add(3, 'days').startOf('day').tz('Asia/Ho_Chi_Minh').format() \n <div> ${moment()
            .add(7, 'days')
            .startOf('day')
            .tz('Asia/Ho_Chi_Minh')
            .format()}
      </div> `
    }),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], GetEventReq.prototype, "timeMax", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'room_id', example: 'room_id' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], GetEventReq.prototype, "room_id", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'creator_id', example: 'creator_id' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], GetEventReq.prototype, "creator_id", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'creator_id', example: 'creator_id' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], GetEventReq.prototype, "creator_email", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'candidate_id', example: 'candidate_id' }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], GetEventReq.prototype, "candidate_id", void 0);
exports.GetEventReq = GetEventReq;


/***/ }),

/***/ "./apps/api/src/modules/google-calendar/dto/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./apps/api/src/modules/google-calendar/dto/create-google-event.dto.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./apps/api/src/modules/google-calendar/dto/get-google-events.dto.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./apps/api/src/modules/google-calendar/dto/update-google-event.dto.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./apps/api/src/modules/google-calendar/dto/detele-google-event.dto.ts"), exports);


/***/ }),

/***/ "./apps/api/src/modules/google-calendar/dto/update-google-event.dto.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateGoogleEventReq = exports.GoogleEventReq$Optional = void 0;
const tslib_1 = __webpack_require__("tslib");
const swagger_1 = __webpack_require__("@nestjs/swagger");
const create_google_event_dto_1 = __webpack_require__("./apps/api/src/modules/google-calendar/dto/create-google-event.dto.ts");
const class_validator_1 = __webpack_require__("class-validator");
const class_transformer_1 = __webpack_require__("class-transformer");
class GoogleEventReq$Optional extends create_google_event_dto_1.CreateGoogleEventReq {
}
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Không phải mã hex, colorId là số nguyên thuộc [0-11]. Gọi api: /api/calendar/color để lấy danh sách mã màu',
        example: '0'
    }),
    (0, class_validator_1.Matches)(/^([0-9]|1[01])$/, {
        message: 'colorId must be a number in [0-11]'
    }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], GoogleEventReq$Optional.prototype, "colorId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        required: true,
        description: 'Phải có một trong hai trường: dateTime hoặc date. Nếu có dateTime thì sẽ không có date. Lưu ý TimeZone',
        example: {
            dateTime: '2021-08-01T09:00:00+07:00',
            timeZone: 'Asia/Ho_Chi_Minh'
        }
    }),
    (0, class_validator_1.IsNotEmptyObject)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => create_google_event_dto_1.EventDate),
    tslib_1.__metadata("design:type", typeof (_a = typeof create_google_event_dto_1.EventDate !== "undefined" && create_google_event_dto_1.EventDate) === "function" ? _a : Object)
], GoogleEventReq$Optional.prototype, "start", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        required: true,
        description: 'Phải có một trong hai trường: dateTime hoặc date. Nếu có dateTime thì sẽ không có date.Lưu ý TimeZone',
        example: {
            dateTime: '2021-08-01T09:30:00+07:00',
            timeZone: 'Asia/Ho_Chi_Minh'
        }
    }),
    (0, class_validator_1.IsNotEmptyObject)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => create_google_event_dto_1.EventDate),
    tslib_1.__metadata("design:type", typeof (_b = typeof create_google_event_dto_1.EventDate !== "undefined" && create_google_event_dto_1.EventDate) === "function" ? _b : Object)
], GoogleEventReq$Optional.prototype, "end", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        required: true,
        description: 'Title of Event',
        example: 'Event title'
    }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], GoogleEventReq$Optional.prototype, "summary", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Có xóa meet hay không',
        example: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], GoogleEventReq$Optional.prototype, "is_remove_meet", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        required: true,
        description: 'Meta của Event. Lưu ý: room_id là bắt buộc',
        example: {
            room_id: '123456789',
            room_name: '1321'
        }
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_transformer_1.Type)(() => create_google_event_dto_1.EventMetaData),
    (0, class_validator_1.ValidateNested)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", typeof (_c = typeof create_google_event_dto_1.EventMetaData !== "undefined" && create_google_event_dto_1.EventMetaData) === "function" ? _c : Object)
], GoogleEventReq$Optional.prototype, "extendedProperties", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        required: true,
        description: 'single: chỉ update event này, all: update tất cả các instance event, follow: update tất cả các event sau event này',
        example: 'single | all | following'
    }),
    (0, class_validator_1.IsEnum)(['single', 'all', 'following'], {
        message: 'update_type must be a string in [single, all, following]'
    }),
    tslib_1.__metadata("design:type", String)
], GoogleEventReq$Optional.prototype, "update_type", void 0);
exports.GoogleEventReq$Optional = GoogleEventReq$Optional;
class UpdateGoogleEventReq extends GoogleEventReq$Optional {
}
exports.UpdateGoogleEventReq = UpdateGoogleEventReq;


/***/ }),

/***/ "./apps/api/src/modules/google-calendar/gcanlendar.controller.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GoogleCalendarController = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const swagger_1 = __webpack_require__("@nestjs/swagger");
const winston_1 = __webpack_require__("winston");
const utils_1 = __webpack_require__("./apps/api/src/utils/index.ts");
const pipe_1 = __webpack_require__("./apps/api/src/utils/pipe.ts");
const role_guard_1 = __webpack_require__("./apps/api/src/modules/authentication/guard/role.guard.ts");
const dto_1 = __webpack_require__("./apps/api/src/modules/google-calendar/dto/index.ts");
const gcanlendar_service_1 = __webpack_require__("./apps/api/src/modules/google-calendar/gcanlendar.service.ts");
const auth_user_1 = __webpack_require__("./apps/api/src/modules/google-calendar/types/auth.user.ts");
let GoogleCalendarController = class GoogleCalendarController {
    constructor(logger, gcanlendarService) {
        this.logger = logger;
        this.gcanlendarService = gcanlendarService;
    }
    getCalendarEvents(query) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (0, utils_1.response)(yield this.gcanlendarService.getEventsService(query));
        });
    }
    getCalendarEventById(eventId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (0, utils_1.response)(yield this.gcanlendarService.getCalendarEventByIdService(eventId));
        });
    }
    updateEvent(eventId, event) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (0, utils_1.response)(yield this.gcanlendarService.updateEventService(eventId, event));
        });
    }
    createEvents(event, user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (0, utils_1.response)(yield this.gcanlendarService.createEventsService(event, user));
        });
    }
    authorizeGoogle() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (0, utils_1.response)(yield this.gcanlendarService.authorize());
        });
    }
    getAvailableColor() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (0, utils_1.response)(yield this.gcanlendarService.getColorEventService());
        });
    }
    deleteEvent(eventId, query) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (0, utils_1.response)(yield this.gcanlendarService.deleteEventService(eventId, query));
        });
    }
    // @UseGuards(JwtAuthGuard)
    getRecurrenceInstances(eventId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (0, utils_1.response)(yield this.gcanlendarService.getInstanceOfRecurrenceService(eventId));
        });
    }
    oauth2callback(code) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (0, utils_1.response)(yield this.gcanlendarService.oauth2callback(code));
        });
    }
};
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get All calendar events', description: 'Get calendar events' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Get calendar events', type: [dto_1.CreateGoogleEventReq] })
    // @UseGuards(JwtAuthGuard)
    ,
    (0, common_1.Get)('event'),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_c = typeof dto_1.GetEventReq !== "undefined" && dto_1.GetEventReq) === "function" ? _c : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], GoogleCalendarController.prototype, "getCalendarEvents", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get event detail by id', description: 'Get calendar event by id' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, type: dto_1.CreateGoogleEventReq })
    // @UseGuards(JwtAuthGuard)
    ,
    (0, common_1.Get)('event/:eventId'),
    tslib_1.__param(0, (0, common_1.Param)('eventId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], GoogleCalendarController.prototype, "getCalendarEventById", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update Event' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, type: dto_1.CreateGoogleEventReq })
    // @UseGuards(PermisionUpdate())
    // @UseGuards(JwtAuthGuard)
    ,
    (0, common_1.Put)('/event/:eventId'),
    tslib_1.__param(0, (0, common_1.Param)('eventId')),
    tslib_1.__param(1, (0, common_1.Body)(new pipe_1.EventDatePipe())),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, typeof (_d = typeof dto_1.UpdateGoogleEventReq !== "undefined" && dto_1.UpdateGoogleEventReq) === "function" ? _d : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], GoogleCalendarController.prototype, "updateEvent", null);
tslib_1.__decorate([
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, type: dto_1.CreateGoogleEventReq }),
    (0, swagger_1.ApiOperation)({ summary: 'Create Google calendar event', description: 'Create Google calendar event' })
    // @UseGuards(JwtAuthGuard)
    ,
    (0, common_1.Post)('/event'),
    tslib_1.__param(0, (0, common_1.Body)(new pipe_1.EventDatePipe())),
    tslib_1.__param(1, (0, role_guard_1.AuthUser)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_e = typeof dto_1.CreateGoogleEventReq !== "undefined" && dto_1.CreateGoogleEventReq) === "function" ? _e : Object, typeof (_f = typeof auth_user_1.User !== "undefined" && auth_user_1.User) === "function" ? _f : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], GoogleCalendarController.prototype, "createEvents", null);
tslib_1.__decorate([
    (0, common_1.Get)('/authorize'),
    (0, swagger_1.ApiOperation)({ summary: 'API for Admin only' }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], GoogleCalendarController.prototype, "authorizeGoogle", null);
tslib_1.__decorate([
    (0, common_1.Get)('/color'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available Calendar list colors' }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], GoogleCalendarController.prototype, "getAvailableColor", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete event' })
    // @UseGuards(PermisionUpdate())
    // @UseGuards(JwtAuthGuard)
    ,
    (0, common_1.Delete)('event/:eventId'),
    tslib_1.__param(0, (0, common_1.Param)('eventId')),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, typeof (_g = typeof dto_1.DeleteEventReq !== "undefined" && dto_1.DeleteEventReq) === "function" ? _g : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], GoogleCalendarController.prototype, "deleteEvent", null);
tslib_1.__decorate([
    (0, common_1.Get)('event/instance/:eventId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all instances of the specified recurring event' }),
    tslib_1.__param(0, (0, common_1.Param)('eventId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], GoogleCalendarController.prototype, "getRecurrenceInstances", null);
tslib_1.__decorate([
    (0, common_1.Get)('oauth2callback'),
    tslib_1.__param(0, (0, common_1.Query)('code')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], GoogleCalendarController.prototype, "oauth2callback", null);
GoogleCalendarController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Google Calendar'),
    (0, common_1.Controller)('calendar'),
    tslib_1.__param(0, (0, common_1.Inject)('winston')),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof winston_1.Logger !== "undefined" && winston_1.Logger) === "function" ? _a : Object, typeof (_b = typeof gcanlendar_service_1.GoogleCalendarService !== "undefined" && gcanlendar_service_1.GoogleCalendarService) === "function" ? _b : Object])
], GoogleCalendarController);
exports.GoogleCalendarController = GoogleCalendarController;


/***/ }),

/***/ "./apps/api/src/modules/google-calendar/gcanlendar.module.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GoogleCalendarModule = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const gcanlendar_controller_1 = __webpack_require__("./apps/api/src/modules/google-calendar/gcanlendar.controller.ts");
const gcanlendar_service_1 = __webpack_require__("./apps/api/src/modules/google-calendar/gcanlendar.service.ts");
const auth_module_1 = __webpack_require__("./apps/api/src/modules/authentication/auth.module.ts");
let GoogleCalendarModule = class GoogleCalendarModule {
};
GoogleCalendarModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule],
        controllers: [gcanlendar_controller_1.GoogleCalendarController],
        providers: [gcanlendar_service_1.GoogleCalendarService],
        exports: []
    })
], GoogleCalendarModule);
exports.GoogleCalendarModule = GoogleCalendarModule;


/***/ }),

/***/ "./apps/api/src/modules/google-calendar/gcanlendar.service.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GoogleCalendarService = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const config_1 = __webpack_require__("@nestjs/config");
const crypto_1 = __webpack_require__("crypto");
const fs_1 = __webpack_require__("fs");
const google_auth_library_1 = __webpack_require__("google-auth-library");
const googleapis_1 = __webpack_require__("googleapis");
const _ = __webpack_require__("lodash");
const path = __webpack_require__("path");
const rrule_1 = __webpack_require__("rrule");
const winston_1 = __webpack_require__("winston");
const controlled_exception_1 = __webpack_require__("./apps/api/src/exception/controlled.exception.ts");
const internal_error_exception_1 = __webpack_require__("./apps/api/src/exception/internal-error.exception.ts");
const types_1 = __webpack_require__("./apps/api/src/types/index.ts");
const helper_1 = __webpack_require__("./apps/api/src/utils/helper.ts");
let GoogleCalendarService = class GoogleCalendarService {
    constructor(configService, logger) {
        this.configService = configService;
        this.logger = logger;
        this.TOKEN_PATH = path.join(process.cwd(), 'token.json');
        this.CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');
        this.calendarId = this.configService.get('GOOGLE_CALANDER_ID');
        this.oAuth2Client = new google_auth_library_1.OAuth2Client(this.configService.get('GOOGLE_CLIENT_ID'), this.configService.get('GOOGLE_CLIENT_SECRET'), this.configService.get('GOOGLE_REDIRECT_URL'));
    }
    oauth2callback(code) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const r = yield this.oAuth2Client.getToken(code);
                this.oAuth2Client.setCredentials(r.tokens);
                this.calendar = googleapis_1.google.calendar({ version: 'v3', auth: this.oAuth2Client });
                yield this.saveCredentials(r.tokens);
                this.logger.info('oauth2callback() OK', r.tokens);
            }
            catch (error) {
                this.logger.error('oauth2callback() FAIL', error);
                throw new internal_error_exception_1.ServerError(error);
            }
        });
    }
    loadSavedCredentialsIfExist() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const content = yield fs_1.promises.readFile(this.TOKEN_PATH, 'ascii');
                return JSON.parse(content);
            }
            catch (error) {
                this.logger.error('loadSavedCredentialsIfExist() FAIL', error);
                return null;
            }
        });
    }
    saveCredentials(token) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield fs_1.promises.writeFile(this.TOKEN_PATH, JSON.stringify(token));
        });
    }
    authorize() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const savedToken = yield this.loadSavedCredentialsIfExist();
                if (savedToken) {
                    this.oAuth2Client.setCredentials(savedToken);
                    if (savedToken.expiry_date < Date.now()) {
                        const newToken = yield this.oAuth2Client.refreshAccessToken();
                        yield this.saveCredentials(newToken.credentials);
                        this.logger.info('Token expired, refreshing token', { newToken: newToken.credentials });
                        this.oAuth2Client.setCredentials(newToken.credentials);
                    }
                    this.calendar = googleapis_1.google.calendar({ version: 'v3', auth: this.oAuth2Client });
                    return types_1.message.GOOGLE_AUTHORIZED;
                }
                this.logger.info('Authorizing Google Calendar,...', { path: this.CREDENTIALS_PATH });
                const authorizeUrl = this.oAuth2Client.generateAuthUrl({
                    access_type: 'offline',
                    scope: 'https://www.googleapis.com/auth/calendar'
                });
                return authorizeUrl;
            }
            catch (error) {
                this.logger.error('Google Calendar Authorize Fail', error);
                throw new internal_error_exception_1.ServerError({
                    message: 'Google Calendar Authorize Fail !'
                });
            }
        });
    }
    googleExceptionHandler(error, message) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if ([404, 410].includes(error.code)) {
                throw new controlled_exception_1.ExceptionNotFound(message);
            }
            if ([403].includes(error.status)) {
                throw new controlled_exception_1.ExceptionForbidden(message);
            }
            if ([400].includes(error.code || error.status)) {
                throw error;
            }
            if (!this.calendar || !this.oAuth2Client) {
                throw new controlled_exception_1.ExceptionUnauthorized('Unauthorized, Please re-auth with Google Calendar');
            }
            if (types_1.GoogleAuthError.includes(error.message)) {
                this.logger.error('Refresh Token invalid, Remove Token File, Try to re-auth');
                yield fs_1.promises.unlink(this.TOKEN_PATH);
                this.oAuth2Client = null;
                this.authorize();
            }
            if (error.message === types_1.GoogleError.LIMIT_EXCEEDED) {
                throw new controlled_exception_1.ExceptionBadRequest({
                    message: 'Limit Exceeded'
                });
            }
            throw new internal_error_exception_1.ServerError(message);
        });
    }
    createEventsService(event, user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authorize();
                if (user === null || user === void 0 ? void 0 : user.id) {
                    event.extendedProperties.creator_id = user === null || user === void 0 ? void 0 : user.id;
                }
                const res = yield this.calendar.events.insert({
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
                        start: Object.assign(Object.assign({}, event.start), { timeZone: types_1.VN }),
                        end: Object.assign(Object.assign({}, event.end), { timeZone: types_1.VN }),
                        attendees: event.attendees || [],
                        reminders: {
                            useDefault: false,
                            overrides: [{ method: 'email', minutes: 30 }]
                        },
                        conferenceData: event.is_new_meet && {
                            createRequest: {
                                conferenceSolutionKey: { type: 'hangoutsMeet' },
                                requestId: (0, crypto_1.randomUUID)()
                            }
                        },
                        extendedProperties: {
                            private: Object.assign({}, event === null || event === void 0 ? void 0 : event.extendedProperties)
                        }
                    }
                });
                return res.data;
            }
            catch (error) {
                this.logger.error(error);
                return this.googleExceptionHandler(error, {
                    info: 'Error: create event failed!',
                    detail: error === null || error === void 0 ? void 0 : error.message
                });
            }
        });
    }
    getInstanceOfRecurrenceService(eventId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authorize();
                const eventInstance = yield this.calendar.events.instances({
                    eventId: eventId,
                    calendarId: this.calendarId
                });
                return eventInstance.data.items.sort((a, b) => {
                    var _a, _b, _c, _d;
                    return (0, helper_1.date_sort_asc)(((_a = a.originalStartTime) === null || _a === void 0 ? void 0 : _a.date) || ((_b = a.originalStartTime) === null || _b === void 0 ? void 0 : _b.dateTime), ((_c = b.originalStartTime) === null || _c === void 0 ? void 0 : _c.date) || ((_d = b.originalStartTime) === null || _d === void 0 ? void 0 : _d.dateTime));
                });
            }
            catch (error) {
                this.logger.error('getInstanceOfRecurrenceService()', error);
                return this.googleExceptionHandler(error, 'Get instance of recurrence event failed');
            }
        });
    }
    /**
     * @param getReq
     * @description Get all events in range time
     */
    getEventsService(getReq) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const { room_id, creator_id, creator_email, candidate_id } = getReq;
                yield this.authorize();
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
                };
                let res = (yield this.calendar.events.list(request)).data.items;
                if (creator_id) {
                    res = res.filter((event) => {
                        var _a, _b, _c, _d, _e;
                        const isCreator = ((_b = (_a = event === null || event === void 0 ? void 0 : event.extendedProperties) === null || _a === void 0 ? void 0 : _a.private) === null || _b === void 0 ? void 0 : _b.creator_id) === creator_id;
                        const isAttendee = (_e = (_d = (_c = event === null || event === void 0 ? void 0 : event.extendedProperties) === null || _c === void 0 ? void 0 : _c.private) === null || _d === void 0 ? void 0 : _d.attendees_id) === null || _e === void 0 ? void 0 : _e.split(',').includes(creator_id);
                        if (isCreator || isAttendee) {
                            return this.event(event);
                        }
                    });
                }
                return res.filter((event) => {
                    var _a, _b;
                    if (room_id === 'all' || getReq.candidate_id || room_id === 'null') {
                        return this.event(event);
                    }
                    if (room_id !== 'all' && ((_b = (_a = event === null || event === void 0 ? void 0 : event.extendedProperties) === null || _a === void 0 ? void 0 : _a.private) === null || _b === void 0 ? void 0 : _b.room_id) !== 'null') {
                        return this.event(event);
                    }
                });
            }
            catch (error) {
                this.logger.error('getEventsService()', error);
                return this.googleExceptionHandler(error, 'Get events failed');
            }
        });
    }
    getCalendarEventByIdService(eventId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authorize();
                const res = yield this.calendar.events.get({
                    calendarId: this.calendarId,
                    eventId: eventId
                });
                return res.data;
            }
            catch (error) {
                this.logger.error('getCalendarEventByIdService()', error);
                return this.googleExceptionHandler(error, 'Event not found');
            }
        });
    }
    getColorEventService() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authorize();
                const res = yield this.calendar.colors.get();
                return res.data.calendar;
            }
            catch (error) {
                this.logger.error(error);
                return this.googleExceptionHandler(error, 'Error: get color event failed');
            }
        });
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
    updateEventService(id, updateEventReq) {
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authorize();
                const event = yield this.getCalendarEventByIdService(id);
                if (!event) {
                    throw new controlled_exception_1.ExceptionNotFound('Event not found');
                }
                // Copy of updateEventReq and remove some fields
                const newEvent = _.omit(Object.assign({}, updateEventReq), ['extendedProperties', 'recurrence']);
                // Remove meeting
                if (updateEventReq === null || updateEventReq === void 0 ? void 0 : updateEventReq.is_remove_meet) {
                    newEvent.conferenceData = null;
                    if (!event.conferenceData) {
                        newEvent.conferenceData = {
                            createRequest: {
                                conferenceSolutionKey: {
                                    type: 'hangoutsMeet'
                                },
                                requestId: (0, crypto_1.randomUUID)()
                            }
                        };
                    }
                }
                // Create new meeting
                if (updateEventReq.is_new_meet) {
                    newEvent.conferenceData = {
                        createRequest: {
                            conferenceSolutionKey: {
                                type: 'hangoutsMeet'
                            },
                            requestId: (0, crypto_1.randomUUID)()
                        }
                    };
                }
                // Make sure that creator_id is not changed event if User is Admin
                if (undefined !== updateEventReq.extendedProperties) {
                    updateEventReq.extendedProperties.creator_id = (_b = (_a = event === null || event === void 0 ? void 0 : event.extendedProperties) === null || _a === void 0 ? void 0 : _a.private) === null || _b === void 0 ? void 0 : _b.creator_id;
                }
                // Main Logic
                switch (updateEventReq.update_type) {
                    case types_1.UpdateType.SINGLE:
                        return this.updateSingleEventService(id, updateEventReq, event, newEvent);
                    case types_1.UpdateType.ALL:
                        return this.updateAllEventService(id, updateEventReq, event, newEvent);
                    case types_1.UpdateType.FOLLOWING:
                        return this.updateFollowedEventService(id, updateEventReq, event, newEvent);
                }
            }
            catch (error) {
                this.logger.error('updateEventService()', error);
                return this.googleExceptionHandler(error, 'Update event failed');
            }
        });
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
    updateSingleEventService(id, updateEventReq, orginalEvent, newEvent) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authorize();
                if (orginalEvent.recurrence) {
                    throw new controlled_exception_1.ExceptionBadRequest('This is not a Single Event. Use update_type equal ALL or FOLLOWING instead');
                }
                // 3.
                if (!(orginalEvent === null || orginalEvent === void 0 ? void 0 : orginalEvent.recurringEventId) && (updateEventReq === null || updateEventReq === void 0 ? void 0 : updateEventReq.recurrence)) {
                    this.logger.info('3. Update orignal Single Event to be a Recurring event (Add RRULE)');
                    newEvent.recurrence = updateEventReq.recurrence;
                }
                // 4.
                if ((orginalEvent === null || orginalEvent === void 0 ? void 0 : orginalEvent.recurringEventId) && (updateEventReq === null || updateEventReq === void 0 ? void 0 : updateEventReq.recurrence) === null) {
                    this.logger.info('4. Update Recurring event to be a Single Event (Remove Recurrence)');
                    newEvent.recurrence = null;
                    newEvent.start = orginalEvent.start;
                    newEvent.end = orginalEvent.end;
                    id = id.split('_')[0];
                }
                this.logger.info('LOG', Object.assign(Object.assign({}, orginalEvent), newEvent));
                // 1. + 2.
                const res = yield this.calendar.events.patch({
                    calendarId: this.calendarId,
                    conferenceDataVersion: 1,
                    eventId: id,
                    sendNotifications: true,
                    requestBody: Object.assign(Object.assign(Object.assign({}, orginalEvent), newEvent), { summary: `Update-${new Date().toLocaleTimeString(undefined, { timeZone: types_1.VN })}`, extendedProperties: {
                            private: Object.assign(Object.assign({}, (_a = orginalEvent === null || orginalEvent === void 0 ? void 0 : orginalEvent.extendedProperties) === null || _a === void 0 ? void 0 : _a.private), updateEventReq === null || updateEventReq === void 0 ? void 0 : updateEventReq.extendedProperties)
                        } })
                });
                return res.data;
            }
            catch (error) {
                this.logger.error('updateSingleEventService()', error);
                return this.googleExceptionHandler(error, 'Update event failed');
            }
        });
    }
    /**
     * @param id
     * @param updateEventReq
     * @param orginalEvent
     * @param newEvent
     * @description
     * 1. Update recurrence event - root Event (not the first instance)
     */
    updateAllEventService(id, updateEventReq, orginalEvent, newEvent) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authorize();
                const rootId = id.split('_')[0];
                let instanceEvent;
                if (id.includes('_')) {
                    // Not the root event
                    instanceEvent = Object.assign({}, orginalEvent);
                    orginalEvent = yield this.getCalendarEventByIdService(rootId);
                }
                else {
                    instanceEvent = Object.assign({}, orginalEvent);
                }
                // 1. Update recurrence event - root Event (not the first instance)
                newEvent.recurrence = updateEventReq.recurrence;
                if (newEvent.start) {
                    const { status, value } = (0, helper_1.date_diff)(newEvent.start.dateTime, instanceEvent.start.dateTime);
                    newEvent.start.dateTime = (0, helper_1.date_add_milisecond)(orginalEvent.start.dateTime, value);
                }
                if (newEvent.end) {
                    const { status, value } = (0, helper_1.date_diff)(newEvent.end.dateTime, instanceEvent.end.dateTime);
                    newEvent.end.dateTime = (0, helper_1.date_add_milisecond)(orginalEvent.end.dateTime, value);
                }
                const res = yield this.calendar.events.patch({
                    calendarId: this.calendarId,
                    conferenceDataVersion: 1,
                    eventId: rootId,
                    sendNotifications: true,
                    requestBody: Object.assign(Object.assign(Object.assign({}, orginalEvent), newEvent), { summary: `Update-${new Date().toLocaleTimeString()}`, extendedProperties: {
                            private: Object.assign(Object.assign({}, (_a = orginalEvent === null || orginalEvent === void 0 ? void 0 : orginalEvent.extendedProperties) === null || _a === void 0 ? void 0 : _a.private), updateEventReq === null || updateEventReq === void 0 ? void 0 : updateEventReq.extendedProperties)
                        } })
                });
                return res.data;
            }
            catch (error) {
                this.logger.error('updateAllEventService()', error);
                return this.googleExceptionHandler(error, 'Update event failed');
            }
        });
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
    updateFollowedEventService(id, updateEventReq, originalEvent, newEvent) {
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authorize();
                if (!id.includes('_')) {
                    throw new controlled_exception_1.ExceptionBadRequest('This is not a instance of Recurring Event. Use update_type equal ALL or SINGLE instead');
                }
                const recurrenEvent = yield this.getCalendarEventByIdService(originalEvent.recurringEventId);
                if (!recurrenEvent) {
                    throw new controlled_exception_1.ExceptionNotFound('Recurring Event not found');
                }
                if (updateEventReq.recurrence === null || ((_a = updateEventReq.recurrence) === null || _a === void 0 ? void 0 : _a.length) === 0) {
                    throw new controlled_exception_1.ExceptionBadRequest('Recurrence == NULL can not be used with update_type == FOLLOWING, use SINGLE instead');
                }
                const instanceOfRecurringEvent = yield this.getInstanceOfRecurrenceService(originalEvent.recurringEventId);
                const followedEvents = instanceOfRecurringEvent.filter((event) => {
                    return ((0, helper_1.date_sort_asc)(event.originalStartTime.date || event.originalStartTime.dateTime, originalEvent.originalStartTime.date || originalEvent.originalStartTime.dateTime) === 1);
                });
                if (!instanceOfRecurringEvent || (instanceOfRecurringEvent === null || instanceOfRecurringEvent === void 0 ? void 0 : instanceOfRecurringEvent.length) === 0) {
                    throw new controlled_exception_1.ExceptionNotFound('Recurring Event not found');
                }
                // 1.
                if (instanceOfRecurringEvent[0].id === originalEvent.id) {
                    this.logger.info('1. Check if event is the first instance of recurring event %s', originalEvent.recurringEventId);
                    if (recurrenEvent) {
                        const res = yield this.calendar.events.patch({
                            calendarId: this.calendarId,
                            conferenceDataVersion: 1,
                            eventId: originalEvent.recurringEventId,
                            sendNotifications: true,
                            requestBody: Object.assign(Object.assign(Object.assign({}, recurrenEvent), newEvent), { recurrence: (updateEventReq === null || updateEventReq === void 0 ? void 0 : updateEventReq.recurrence) || recurrenEvent.recurrence, summary: `Update-${new Date().toLocaleTimeString()}`, extendedProperties: {
                                    private: Object.assign(Object.assign({}, (_b = recurrenEvent === null || recurrenEvent === void 0 ? void 0 : recurrenEvent.extendedProperties) === null || _b === void 0 ? void 0 : _b.private), updateEventReq === null || updateEventReq === void 0 ? void 0 : updateEventReq.extendedProperties)
                                } })
                        });
                        return res.data;
                    }
                }
                // 3.
                const update_status = this.isCreateRecurrenEvent(originalEvent, updateEventReq, recurrenEvent);
                if (update_status.result) {
                    this.logger.info('3. Update an instance of recurring event that is not the first instance, update current Rule and CREATE new one');
                    const currentRule = rrule_1.RRule.fromString(recurrenEvent.recurrence[0]);
                    const updatedRule = new rrule_1.RRule(Object.assign(Object.assign({}, currentRule.options), { dtstart: null, count: null, byhour: null, byminute: null, bysecond: null, until: (0, helper_1.date_substract)(originalEvent, 1) })).toString();
                    yield this.updateAllEventService(id, { recurrence: [updatedRule] }, recurrenEvent, {});
                    this.logger.info('Create new recurrence event');
                    const newRule = new rrule_1.RRule(Object.assign(Object.assign({}, rrule_1.RRule.fromString(updatedRule).options), { count: followedEvents.length, until: null, dtstart: null, byhour: null, byminute: null, bysecond: null })).toString();
                    const newRecurrenceEvent = Object.assign(Object.assign(Object.assign({ recurrence: [newRule] }, originalEvent), updateEventReq), { extendedProperties: Object.assign({}, originalEvent === null || originalEvent === void 0 ? void 0 : originalEvent.extendedProperties.private) });
                    return yield this.createEventsService(newRecurrenceEvent);
                }
                /** 2.
                 * If update request has end time !== NULL, check if it's diff from original event end time
                 * True: Add amount of time diff to all followed events
                 * False: Do nothing
                 */
                if (!update_status.result) {
                    let time_diff = 0;
                    delete newEvent.recurrence;
                    delete newEvent.start;
                    this.logger.info('2. Update basic info of Single Event');
                    if (newEvent.end) {
                        const { status, value } = (0, helper_1.date_diff)(newEvent.end.dateTime, originalEvent.start.dateTime);
                        if (true === status) {
                            time_diff = value;
                        }
                    }
                    const promiseChain = followedEvents.map((event, index) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        return new Promise((resolve) => {
                            setTimeout(resolve, 700 * index);
                        }).then(() => {
                            if (Math.abs(time_diff) > 0) {
                                newEvent.end.dateTime = (0, helper_1.date_add_milisecond)(event.start.dateTime, time_diff);
                            }
                            return this.updateSingleEventService(event.id, updateEventReq, event, newEvent);
                        });
                    }));
                    return yield Promise.allSettled(promiseChain);
                }
            }
            catch (error) {
                this.logger.error('updateFollowedEventService()', error);
                return this.googleExceptionHandler(error, 'Update followed event failed');
            }
        });
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
    deleteEventService(eventId, query) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authorize();
                const event = yield this.getCalendarEventByIdService(eventId);
                if (!event) {
                    throw new controlled_exception_1.ExceptionBadRequest('Event not found');
                }
                if (types_1.DeleteType.FOLLOWING === query.delete_type) {
                    if (undefined === event.recurringEventId) {
                        throw new controlled_exception_1.ExceptionBadRequest('Event is not a recurrence event, use ALL or SINGLE instead');
                    }
                    const recurrenEvent = yield this.getCalendarEventByIdService(event.recurringEventId);
                    if (!recurrenEvent) {
                        throw new controlled_exception_1.ExceptionBadRequest('Recurrence event not found');
                    }
                    const currentRule = rrule_1.RRule.fromString(recurrenEvent.recurrence[0]);
                    const updatedRule = new rrule_1.RRule(Object.assign(Object.assign({}, currentRule.options), { dtstart: null, count: null, byhour: null, byminute: null, bysecond: null, until: (0, helper_1.date_substract)(event, 1) })).toString();
                    yield this.updateAllEventService(event.recurringEventId, { recurrence: [updatedRule] }, recurrenEvent, {});
                }
                if (types_1.DeleteType.ALL === query.delete_type) {
                    if (undefined !== event.recurringEventId) {
                        yield this.calendar.events.delete({
                            calendarId: this.calendarId,
                            eventId: event.recurringEventId
                        });
                    }
                    else {
                        yield this.calendar.events.delete({
                            calendarId: this.calendarId,
                            eventId: event.id
                        });
                    }
                }
                if (types_1.DeleteType.SINGLE === query.delete_type) {
                    yield this.calendar.events.delete({
                        calendarId: this.calendarId,
                        eventId: event.id
                    });
                }
                return 'Delete event successfully';
            }
            catch (error) {
                this.logger.error(error);
                return this.googleExceptionHandler(error, 'Error: remove event failed');
            }
        });
    }
    /**
     * @return {Status}
     * @description check if it's need to create new Recurrence Event if:
     * 1. New start Time
     * 2. All day event -> one day event
     * 3. One day event -> all day event
     * 4. New Recurrence
     */
    isCreateRecurrenEvent(orignalEvent, updateRequest, recurrenceEvent) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        try {
            const isNoStartTime = !((_a = updateRequest.start) === null || _a === void 0 ? void 0 : _a.dateTime) && !((_b = updateRequest.start) === null || _b === void 0 ? void 0 : _b.date);
            const isNoRecurrence = !(updateRequest === null || updateRequest === void 0 ? void 0 : updateRequest.recurrence);
            if (isNoStartTime && isNoRecurrence) {
                return { result: false, message: 'No need to create new recurrence event' };
            }
            // 4. New Recurrence
            const isNewRules = updateRequest.recurrence &&
                ((_c = JSON.stringify(updateRequest.recurrence)) === null || _c === void 0 ? void 0 : _c.split('').sort().join('')) !==
                    ((_d = JSON.stringify(recurrenceEvent.recurrence || updateRequest.recurrence)) === null || _d === void 0 ? void 0 : _d.split('').sort().join(''));
            if (isNewRules) {
                this.logger.info('new_recurrence');
                return { result: true, message: types_1.UpdateType.RECURRENCE };
            }
            // 2. All day event -> one day event
            const isAllDayEvent = ((_e = orignalEvent.start) === null || _e === void 0 ? void 0 : _e.dateTime) && ((_f = updateRequest.start) === null || _f === void 0 ? void 0 : _f.date);
            if (isAllDayEvent)
                return { result: true, message: types_1.UpdateType.ALLDAY };
            // 3. One day event -> all day event
            const isOneDayEvent = ((_g = orignalEvent.start) === null || _g === void 0 ? void 0 : _g.date) && ((_h = updateRequest.start) === null || _h === void 0 ? void 0 : _h.dateTime);
            if (isOneDayEvent)
                return { result: true, message: types_1.UpdateType.ONEDAY };
            // 1. New start Time
            if (((_j = updateRequest.start) === null || _j === void 0 ? void 0 : _j.dateTime) || ((_k = updateRequest.start) === null || _k === void 0 ? void 0 : _k.date)) {
                const isNewStartTime = (0, helper_1.date_diff)(orignalEvent.start.dateTime || orignalEvent.start.date, ((_l = updateRequest.start) === null || _l === void 0 ? void 0 : _l.dateTime) || ((_m = updateRequest.start) === null || _m === void 0 ? void 0 : _m.date));
                if (isNewStartTime.status) {
                    this.logger.info('new_start_time', isNewStartTime);
                    return { result: true, message: types_1.UpdateType.START_TIME };
                }
            }
            return { result: false, message: types_1.UpdateType.NO_CREATE };
        }
        catch (error) {
            this.logger.error(error);
            throw error;
        }
    }
    event(event) {
        return {
            id: event === null || event === void 0 ? void 0 : event.id,
            status: event === null || event === void 0 ? void 0 : event.status,
            summary: event === null || event === void 0 ? void 0 : event.summary,
            description: event === null || event === void 0 ? void 0 : event.description,
            location: event === null || event === void 0 ? void 0 : event.location,
            creator: event === null || event === void 0 ? void 0 : event.creator,
            organizer: event === null || event === void 0 ? void 0 : event.organizer,
            attendees: event === null || event === void 0 ? void 0 : event.attendees,
            start: event === null || event === void 0 ? void 0 : event.start,
            end: event === null || event === void 0 ? void 0 : event.end,
            recurringEventId: event === null || event === void 0 ? void 0 : event.recurringEventId,
            originalStartTime: event === null || event === void 0 ? void 0 : event.originalStartTime,
            recurrence: event === null || event === void 0 ? void 0 : event.recurrence,
            extendedProperties: event === null || event === void 0 ? void 0 : event.extendedProperties
        };
    }
};
GoogleCalendarService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(1, (0, common_1.Inject)('winston')),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object, typeof (_b = typeof winston_1.Logger !== "undefined" && winston_1.Logger) === "function" ? _b : Object])
], GoogleCalendarService);
exports.GoogleCalendarService = GoogleCalendarService;


/***/ }),

/***/ "./apps/api/src/modules/google-calendar/types/auth.user.ts":
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./apps/api/src/modules/room/dtos/create-room.req.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateRoomReq = void 0;
const tslib_1 = __webpack_require__("tslib");
const class_validator_1 = __webpack_require__("class-validator");
const swagger_1 = __webpack_require__("@nestjs/swagger");
class CreateRoomReq {
}
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ required: true, example: 'Cali', uniqueItems: true }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Room name is required' }),
    (0, class_validator_1.Length)(3, 50, { message: 'Room name must be between 3 and 50 characters' }),
    tslib_1.__metadata("design:type", String)
], CreateRoomReq.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ required: true, example: 'HL HANOI' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Location is required' }),
    tslib_1.__metadata("design:type", String)
], CreateRoomReq.prototype, "location", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: ['TV', 'projector'] }),
    (0, class_validator_1.IsArray)({ message: 'devcies must be an array' }),
    (0, class_validator_1.IsString)({ each: true }),
    tslib_1.__metadata("design:type", Array)
], CreateRoomReq.prototype, "devices", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: 'Phòng to nhất SETA' }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], CreateRoomReq.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ required: true, example: 10 }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Capacity is required' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Capacity must be a number' }),
    tslib_1.__metadata("design:type", Number)
], CreateRoomReq.prototype, "capacity", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: 'opening | close' }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], CreateRoomReq.prototype, "status", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: '0 (white)' }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], CreateRoomReq.prototype, "colorId", void 0);
exports.CreateRoomReq = CreateRoomReq;


/***/ }),

/***/ "./apps/api/src/modules/room/dtos/create-room.res.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateRoomRes = void 0;
const create_room_req_1 = __webpack_require__("./apps/api/src/modules/room/dtos/create-room.req.ts");
class CreateRoomRes extends create_room_req_1.CreateRoomReq {
}
exports.CreateRoomRes = CreateRoomRes;


/***/ }),

/***/ "./apps/api/src/modules/room/dtos/get-room.req.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RoomId = void 0;
const tslib_1 = __webpack_require__("tslib");
const class_validator_1 = __webpack_require__("class-validator");
class RoomId {
}
tslib_1.__decorate([
    (0, class_validator_1.IsNumberString)({}, { message: 'Room ID must be a number' }),
    tslib_1.__metadata("design:type", String)
], RoomId.prototype, "id", void 0);
exports.RoomId = RoomId;


/***/ }),

/***/ "./apps/api/src/modules/room/dtos/get-rooms.res.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetRoomRes = void 0;
const tslib_1 = __webpack_require__("tslib");
const swagger_1 = __webpack_require__("@nestjs/swagger");
const types_1 = __webpack_require__("./apps/api/src/types/index.ts");
class GetRoomRes {
}
tslib_1.__decorate([
    (0, swagger_1.ApiResponseProperty)({
        type: Array,
        example: [
            {
                id: 1,
                title: 'String',
                content: 'String',
                createdDate: new Date()
            }
        ]
    }),
    tslib_1.__metadata("design:type", Array)
], GetRoomRes.prototype, "data", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiResponseProperty)({
        type: Object,
        example: {
            total: 1,
            itemPage: 1,
            currentPage: 1,
            lastPage: 1
        }
    }),
    tslib_1.__metadata("design:type", typeof (_a = typeof types_1.Metadata !== "undefined" && types_1.Metadata) === "function" ? _a : Object)
], GetRoomRes.prototype, "metadata", void 0);
exports.GetRoomRes = GetRoomRes;


/***/ }),

/***/ "./apps/api/src/modules/room/dtos/update-room.req.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateRoomReq = void 0;
const tslib_1 = __webpack_require__("tslib");
const swagger_1 = __webpack_require__("@nestjs/swagger");
const create_room_req_1 = __webpack_require__("./apps/api/src/modules/room/dtos/create-room.req.ts");
const class_validator_1 = __webpack_require__("class-validator");
class UpdateRoomReq extends create_room_req_1.CreateRoomReq {
}
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ required: true, example: 'Cali', uniqueItems: true }),
    (0, class_validator_1.Length)(3, 50, { message: 'Room name must be between 3 and 50 characters' }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], UpdateRoomReq.prototype, "name", void 0);
exports.UpdateRoomReq = UpdateRoomReq;


/***/ }),

/***/ "./apps/api/src/modules/room/room.controller.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RoomController = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const swagger_1 = __webpack_require__("@nestjs/swagger");
const winston_1 = __webpack_require__("winston");
const room_service_1 = __webpack_require__("./apps/api/src/modules/room/room.service.ts");
const create_room_req_1 = __webpack_require__("./apps/api/src/modules/room/dtos/create-room.req.ts");
const get_room_req_1 = __webpack_require__("./apps/api/src/modules/room/dtos/get-room.req.ts");
const create_room_res_1 = __webpack_require__("./apps/api/src/modules/room/dtos/create-room.res.ts");
const get_rooms_res_1 = __webpack_require__("./apps/api/src/modules/room/dtos/get-rooms.res.ts");
const utils_1 = __webpack_require__("./apps/api/src/utils/index.ts");
const update_room_req_1 = __webpack_require__("./apps/api/src/modules/room/dtos/update-room.req.ts");
let RoomController = class RoomController {
    constructor(logger, roomService) {
        this.logger = logger;
        this.roomService = roomService;
    }
    createMeetingRoom(body) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (0, utils_1.response)(yield this.roomService.createMeetingRoomService(body));
        });
    }
    getAllRooms() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (0, utils_1.response)(yield this.roomService.getAllRoomsService());
        });
    }
    getRoomById(params) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (0, utils_1.response)(yield this.roomService.getRoomByIdService(params.id));
        });
    }
    updateRoomById(body, params) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (0, utils_1.response)(yield this.roomService.updateRoomByIdService(params.id, body));
        });
    }
    deleteRoomById(params) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (0, utils_1.response)(yield this.roomService.deleteRoomByIdService(params.id));
        });
    }
};
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create a meeting room' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CREATED, description: 'Create a meeting room', type: create_room_res_1.CreateRoomRes }),
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_c = typeof create_room_req_1.CreateRoomReq !== "undefined" && create_room_req_1.CreateRoomReq) === "function" ? _c : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], RoomController.prototype, "createMeetingRoom", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get Room List' }),
    (0, swagger_1.ApiResponse)({ type: create_room_res_1.CreateRoomRes }),
    (0, common_1.Get)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], RoomController.prototype, "getAllRooms", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get room by ID' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CREATED, description: 'Create a meeting room', type: get_rooms_res_1.GetRoomRes }),
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_d = typeof get_room_req_1.RoomId !== "undefined" && get_room_req_1.RoomId) === "function" ? _d : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], RoomController.prototype, "getRoomById", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update room infomation (Update info, lock room' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CREATED, description: 'Create a meeting room', type: create_room_res_1.CreateRoomRes }),
    (0, common_1.Put)(':id'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, common_1.Param)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_e = typeof update_room_req_1.UpdateRoomReq !== "undefined" && update_room_req_1.UpdateRoomReq) === "function" ? _e : Object, typeof (_f = typeof get_room_req_1.RoomId !== "undefined" && get_room_req_1.RoomId) === "function" ? _f : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], RoomController.prototype, "updateRoomById", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete room by ID' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NO_CONTENT, description: 'Delete room by ID' }),
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_g = typeof get_room_req_1.RoomId !== "undefined" && get_room_req_1.RoomId) === "function" ? _g : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], RoomController.prototype, "deleteRoomById", null);
RoomController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Room'),
    (0, common_1.Controller)('room'),
    tslib_1.__param(0, (0, common_1.Inject)('winston')),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof winston_1.Logger !== "undefined" && winston_1.Logger) === "function" ? _a : Object, typeof (_b = typeof room_service_1.RoomService !== "undefined" && room_service_1.RoomService) === "function" ? _b : Object])
], RoomController);
exports.RoomController = RoomController;


/***/ }),

/***/ "./apps/api/src/modules/room/room.module.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RoomModule = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const typeorm_1 = __webpack_require__("@nestjs/typeorm");
const typeorm_2 = __webpack_require__("./apps/api/src/modules/typeorm/index.ts");
const room_controller_1 = __webpack_require__("./apps/api/src/modules/room/room.controller.ts");
const room_service_1 = __webpack_require__("./apps/api/src/modules/room/room.service.ts");
let RoomModule = class RoomModule {
};
RoomModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([typeorm_2.MeetingRoom, typeorm_2.UserEntity])],
        controllers: [room_controller_1.RoomController],
        providers: [room_service_1.RoomService],
        exports: []
    })
], RoomModule);
exports.RoomModule = RoomModule;


/***/ }),

/***/ "./apps/api/src/modules/room/room.service.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RoomService = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const winston_1 = __webpack_require__("winston");
const typeorm_1 = __webpack_require__("./apps/api/src/modules/typeorm/index.ts");
const typeorm_2 = __webpack_require__("./apps/api/src/modules/typeorm/index.ts");
const typeorm_3 = __webpack_require__("@nestjs/typeorm");
const typeorm_4 = __webpack_require__("typeorm");
const controlled_exception_1 = __webpack_require__("./apps/api/src/exception/controlled.exception.ts");
let RoomService = class RoomService {
    constructor(logger, dataSource, meetingRoomRepository, userEntity) {
        this.logger = logger;
        this.dataSource = dataSource;
        this.meetingRoomRepository = meetingRoomRepository;
        this.userEntity = userEntity;
    }
    createMeetingRoomService(body) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const existedRoom = yield this.meetingRoomRepository.findOne({
                    where: { name: body.name }
                });
                if (existedRoom) {
                    throw new controlled_exception_1.ExceptionConflict('Room name already existed');
                }
                const { name, description, capacity, location, status, devices, colorId } = body;
                const newRoom = this.meetingRoomRepository.create({
                    name,
                    description,
                    capacity,
                    location,
                    status,
                    devices,
                    colorId
                });
                return yield this.meetingRoomRepository.save(newRoom);
            }
            catch (error) {
                this.logger.error(error);
                throw error;
            }
        });
    }
    getAllRoomsService() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.meetingRoomRepository.find();
            }
            catch (error) {
                this.logger.error(error);
                throw error;
            }
        });
    }
    getRoomByIdService(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const room = yield this.meetingRoomRepository.findOne({
                    where: { id }
                });
                // const res = await this.dataSource
                //   .createQueryBuilder()
                //   .select([
                //     'meeting_room.id as id',
                //     'meeting_room.name as name',
                //     'meeting_room.description as description',
                //     'meeting_room.capacity as capacity',
                //     'meeting_room.location as location',
                //     'meeting_room.status as status',
                //     'user_entity.id as user_id',
                //     'user_entity.name as user_name',
                //     'user_entity.email as user_email'
                //   ])
                //   .from('calendar.meeting_room', 'meeting_room') // Alisas name could === table's name
                //   .addFrom('core_admin.user', 'user_entity') // Alias HAVE TO !== table's name
                //   .where('meeting_room.user_id = user_entity.id')
                //   .getRawMany() // important
                if (!room) {
                    throw new controlled_exception_1.ExceptionNotFound('Room not found');
                }
                return room;
            }
            catch (error) {
                this.logger.error(error);
                throw error;
            }
        });
    }
    updateRoomByIdService(id, body) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const existedRoom = yield this.dataSource.manager.findOne(typeorm_1.MeetingRoom, {
                    where: { id }
                });
                if (!existedRoom) {
                    throw new controlled_exception_1.ExceptionNotFound('Room not found');
                }
                if (body.name && body.name !== existedRoom.name) {
                    const existedRoomName = yield this.dataSource.manager.findOne(typeorm_1.MeetingRoom, {
                        where: { name: body.name }
                    });
                    if (existedRoomName && existedRoomName.id !== id) {
                        throw new controlled_exception_1.ExceptionConflict('Room name already existed');
                    }
                }
                for (const key in existedRoom) {
                    if (body[key]) {
                        existedRoom[key] = body[key];
                    }
                }
                return yield this.meetingRoomRepository.save(existedRoom);
            }
            catch (error) {
                this.logger.error(error);
                throw error;
            }
        });
    }
    deleteRoomByIdService(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const existedRoom = yield this.dataSource.manager.findOne(typeorm_1.MeetingRoom, {
                    where: { id }
                });
                if (!existedRoom) {
                    throw new controlled_exception_1.ExceptionNotFound('Room not found');
                }
                yield this.meetingRoomRepository.remove(existedRoom);
                return 'Room deleted successfully';
            }
            catch (error) {
                this.logger.error(error);
                throw error;
            }
        });
    }
};
RoomService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)('winston')),
    tslib_1.__param(1, (0, typeorm_3.InjectDataSource)()),
    tslib_1.__param(2, (0, typeorm_3.InjectRepository)(typeorm_1.MeetingRoom)),
    tslib_1.__param(3, (0, typeorm_3.InjectRepository)(typeorm_2.UserEntity)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof winston_1.Logger !== "undefined" && winston_1.Logger) === "function" ? _a : Object, typeof (_b = typeof typeorm_4.DataSource !== "undefined" && typeorm_4.DataSource) === "function" ? _b : Object, typeof (_c = typeof typeorm_4.Repository !== "undefined" && typeorm_4.Repository) === "function" ? _c : Object, typeof (_d = typeof typeorm_4.Repository !== "undefined" && typeorm_4.Repository) === "function" ? _d : Object])
], RoomService);
exports.RoomService = RoomService;


/***/ }),

/***/ "./apps/api/src/modules/typeorm/entities/common.entity.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommonTimeStamp = void 0;
const tslib_1 = __webpack_require__("tslib");
const typeorm_1 = __webpack_require__("typeorm");
class CommonTimeStamp {
}
tslib_1.__decorate([
    (0, typeorm_1.CreateDateColumn)({
        type: 'timestamptz',
        name: 'created_at'
    }),
    tslib_1.__metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], CommonTimeStamp.prototype, "createdAt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        type: 'timestamptz',
        name: 'updated_at'
    }),
    tslib_1.__metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], CommonTimeStamp.prototype, "updatedAt", void 0);
exports.CommonTimeStamp = CommonTimeStamp;


/***/ }),

/***/ "./apps/api/src/modules/typeorm/entities/event.entity.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventBaseEntity = exports.EventEntity = void 0;
const tslib_1 = __webpack_require__("tslib");
const typeorm_1 = __webpack_require__("typeorm");
const common_entity_1 = __webpack_require__("./apps/api/src/modules/typeorm/entities/common.entity.ts");
const recurrence_event_entity_1 = __webpack_require__("./apps/api/src/modules/typeorm/entities/recurrence_event.entity.ts");
let EventEntity = class EventEntity extends common_entity_1.CommonTimeStamp {
};
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    tslib_1.__metadata("design:type", String)
], EventEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }) // For cross schema join, schema "core_admin"
    ,
    tslib_1.__metadata("design:type", String)
], EventEntity.prototype, "creator_id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], EventEntity.prototype, "title", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], EventEntity.prototype, "description", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], EventEntity.prototype, "end", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], EventEntity.prototype, "start", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => recurrence_event_entity_1.RecurrenEventEntity),
    (0, typeorm_1.JoinColumn)({ name: 'recurrenceId' }),
    tslib_1.__metadata("design:type", typeof (_a = typeof recurrence_event_entity_1.RecurrenEventEntity !== "undefined" && recurrence_event_entity_1.RecurrenEventEntity) === "function" ? _a : Object)
], EventEntity.prototype, "recurrenceId", void 0);
EventEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)({
        name: 'events',
        schema: process.env.PG_SHCEMA_ADMIN
    })
], EventEntity);
exports.EventEntity = EventEntity;
class EventBaseEntity extends common_entity_1.CommonTimeStamp {
}
tslib_1.__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    tslib_1.__metadata("design:type", String)
], EventBaseEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], EventBaseEntity.prototype, "status", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], EventBaseEntity.prototype, "summary", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], EventBaseEntity.prototype, "colorId", void 0);
exports.EventBaseEntity = EventBaseEntity;


/***/ }),

/***/ "./apps/api/src/modules/typeorm/entities/recurrence_event.entity.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RecurrenEventEntity = void 0;
const tslib_1 = __webpack_require__("tslib");
const typeorm_1 = __webpack_require__("typeorm");
const common_entity_1 = __webpack_require__("./apps/api/src/modules/typeorm/entities/common.entity.ts");
let RecurrenEventEntity = class RecurrenEventEntity extends common_entity_1.CommonTimeStamp {
};
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    tslib_1.__metadata("design:type", String)
], RecurrenEventEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }) // For cross schema join, schema "core_admin"
    ,
    tslib_1.__metadata("design:type", String)
], RecurrenEventEntity.prototype, "creator_id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], RecurrenEventEntity.prototype, "title", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], RecurrenEventEntity.prototype, "description", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], RecurrenEventEntity.prototype, "end", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], RecurrenEventEntity.prototype, "start", void 0);
RecurrenEventEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)({
        name: 'events',
        schema: process.env.PG_SHCEMA_ADMIN
    })
], RecurrenEventEntity);
exports.RecurrenEventEntity = RecurrenEventEntity;


/***/ }),

/***/ "./apps/api/src/modules/typeorm/entities/room.entity.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RoomEntity = void 0;
const tslib_1 = __webpack_require__("tslib");
const typeorm_1 = __webpack_require__("typeorm");
const common_entity_1 = __webpack_require__("./apps/api/src/modules/typeorm/entities/common.entity.ts");
let RoomEntity = class RoomEntity extends common_entity_1.CommonTimeStamp {
};
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", String)
], RoomEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 32,
        nullable: false,
        unique: true
    }),
    tslib_1.__metadata("design:type", String)
], RoomEntity.prototype, "name", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 55,
        nullable: false
    }),
    tslib_1.__metadata("design:type", String)
], RoomEntity.prototype, "location", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        type: 'simple-array',
        default: []
    }),
    tslib_1.__metadata("design:type", Array)
], RoomEntity.prototype, "devices", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 55,
        nullable: true
    }),
    tslib_1.__metadata("design:type", String)
], RoomEntity.prototype, "description", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        type: 'int',
        nullable: false
    }),
    tslib_1.__metadata("design:type", Number)
], RoomEntity.prototype, "capacity", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        length: 11,
        nullable: true,
        default: 'opening'
    }),
    tslib_1.__metadata("design:type", String)
], RoomEntity.prototype, "status", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        length: 11,
        default: '0'
    }),
    tslib_1.__metadata("design:type", String)
], RoomEntity.prototype, "colorId", void 0);
RoomEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)({
        name: 'meeting_room',
        schema: process.env.PG_SCHEMA,
        synchronize: true
    })
], RoomEntity);
exports.RoomEntity = RoomEntity;


/***/ }),

/***/ "./apps/api/src/modules/typeorm/entities/user.entity.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserEntity = void 0;
const tslib_1 = __webpack_require__("tslib");
const typeorm_1 = __webpack_require__("typeorm");
let UserEntity = class UserEntity {
};
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    tslib_1.__metadata("design:type", String)
], UserEntity.prototype, "id", void 0);
UserEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)({
        name: 'user',
        schema: 'core_admin',
        synchronize: false
    })
], UserEntity);
exports.UserEntity = UserEntity;


/***/ }),

/***/ "./apps/api/src/modules/typeorm/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RecurrenEventEntity = exports.EventEntity = exports.UserEntity = exports.MeetingRoom = exports.entities = void 0;
const room_entity_1 = __webpack_require__("./apps/api/src/modules/typeorm/entities/room.entity.ts");
Object.defineProperty(exports, "MeetingRoom", ({ enumerable: true, get: function () { return room_entity_1.RoomEntity; } }));
const user_entity_1 = __webpack_require__("./apps/api/src/modules/typeorm/entities/user.entity.ts");
Object.defineProperty(exports, "UserEntity", ({ enumerable: true, get: function () { return user_entity_1.UserEntity; } }));
const event_entity_1 = __webpack_require__("./apps/api/src/modules/typeorm/entities/event.entity.ts");
Object.defineProperty(exports, "EventEntity", ({ enumerable: true, get: function () { return event_entity_1.EventEntity; } }));
const recurrence_event_entity_1 = __webpack_require__("./apps/api/src/modules/typeorm/entities/recurrence_event.entity.ts");
Object.defineProperty(exports, "RecurrenEventEntity", ({ enumerable: true, get: function () { return recurrence_event_entity_1.RecurrenEventEntity; } }));
exports.entities = [room_entity_1.RoomEntity, user_entity_1.UserEntity, event_entity_1.EventEntity, recurrence_event_entity_1.RecurrenEventEntity];


/***/ }),

/***/ "./apps/api/src/modules/typeorm/typeorm.module.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TypeormConfigModule = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const typeorm_1 = __webpack_require__("@nestjs/typeorm");
const _1 = __webpack_require__("./apps/api/src/modules/typeorm/index.ts");
const config_1 = __webpack_require__("@nestjs/config");
let TypeormConfigModule = class TypeormConfigModule {
};
TypeormConfigModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('PG_HOST'),
                    port: configService.get('PG_PORT'),
                    username: configService.get('PG_USER'),
                    password: configService.get('PG_PASSWORD'),
                    database: configService.get('PG_DB'),
                    entities: _1.entities,
                    cli: {
                        migrationsDir: __dirname + '/../database/migrations'
                    },
                    extra: {
                        charset: 'utf8mb4_unicode_ci'
                    },
                    synchronize: configService.get('NODE_ENV') === 'development' ? true : false
                })
            })
        ],
        controllers: [],
        providers: [],
        exports: [typeorm_1.TypeOrmModule]
    })
], TypeormConfigModule);
exports.TypeormConfigModule = TypeormConfigModule;


/***/ }),

/***/ "./apps/api/src/types/common.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Pagination = void 0;
const tslib_1 = __webpack_require__("tslib");
const swagger_1 = __webpack_require__("@nestjs/swagger");
const class_transformer_1 = __webpack_require__("class-transformer");
const class_validator_1 = __webpack_require__("class-validator");
class Pagination {
}
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ required: true, type: Number }),
    (0, class_validator_1.IsNotEmpty)({
        message: 'page is required'
    }),
    (0, class_validator_1.IsNumber)({}, { message: 'page must be a number' }),
    (0, class_validator_1.Min)(1, { message: 'page must be greater than 0' }),
    (0, class_transformer_1.Type)(() => Number),
    tslib_1.__metadata("design:type", Number)
], Pagination.prototype, "page", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ required: true, type: Number }),
    (0, class_validator_1.IsNotEmpty)({
        message: 'limit is required'
    }),
    (0, class_validator_1.IsNumber)({}, { message: 'limit must be a number' }),
    (0, class_validator_1.Min)(1, { message: 'limit must be greater than 0' }),
    (0, class_validator_1.Max)(100, { message: 'limit must be less than 100' }),
    (0, class_transformer_1.Type)(() => Number),
    tslib_1.__metadata("design:type", Number)
], Pagination.prototype, "limit", void 0);
exports.Pagination = Pagination;


/***/ }),

/***/ "./apps/api/src/types/const.ts":
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GoogleAuthError = exports.VN = exports.message = void 0;
var message;
(function (message) {
    message["SUCCESS"] = "Success";
    message["FAIL"] = "Fail";
    message["GOOGLE_AUTH_FAIL"] = "Google auth fail";
    message["GOOGLE_AUTHORIZED"] = "You're already authorized";
})(message = exports.message || (exports.message = {}));
exports.VN = 'Asia/Ho_Chi_Minh';
exports.GoogleAuthError = ['invalid_grant', 'invalid_client', 'Unauthorized', 'Invalid Credentials'];


/***/ }),

/***/ "./apps/api/src/types/enum.ts":
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Role = exports.GoogleError = exports.DeleteType = exports.UpdateType = void 0;
var UpdateType;
(function (UpdateType) {
    UpdateType["SINGLE"] = "single";
    UpdateType["FOLLOWING"] = "following";
    UpdateType["ALL"] = "all";
    UpdateType["RECURRENCE"] = "new_recurrence";
    UpdateType["START_TIME"] = "new_start_time";
    UpdateType["ALLDAY"] = "allday_to_one_day";
    UpdateType["ONEDAY"] = "one_day_to_allday";
    UpdateType["NO_CREATE"] = "No need to create new recurrence event";
})(UpdateType = exports.UpdateType || (exports.UpdateType = {}));
var DeleteType;
(function (DeleteType) {
    DeleteType["SINGLE"] = "single";
    DeleteType["FOLLOWING"] = "following";
    DeleteType["ALL"] = "all";
})(DeleteType = exports.DeleteType || (exports.DeleteType = {}));
var GoogleError;
(function (GoogleError) {
    GoogleError["INVALID_CLIENT"] = "invalid_client";
    GoogleError["INVALID_GRANT"] = "invalid_grant";
    GoogleError["LIMIT_EXCEEDED"] = "Rate Limit Exceeded";
    GoogleError["UNAUTHORIZED"] = "Unauthorized";
    GoogleError["INVALID_CREDENTIALS"] = "Invalid Credentials";
})(GoogleError = exports.GoogleError || (exports.GoogleError = {}));
var Role;
(function (Role) {
    Role["ADMIN"] = "admin";
    Role["MANAGER"] = "manager";
    Role["HR"] = "HR";
    Role["MEMBER"] = "member";
    Role["DIRECTOR"] = "director";
})(Role = exports.Role || (exports.Role = {}));


/***/ }),

/***/ "./apps/api/src/types/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./apps/api/src/types/enum.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./apps/api/src/types/const.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./apps/api/src/types/common.ts"), exports);


/***/ }),

/***/ "./apps/api/src/utils/helper.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.date_add = exports.date_substract = exports.getDateOnly = exports.date_add_milisecond = exports.date_diff = exports.date_sort_asc = exports.getTheFirstInstance = exports.checkOverLapTime = void 0;
const moment = __webpack_require__("moment-timezone");
function checkOverLapTime(time1, time2) {
    const time1Start = moment(time1.start);
    const time1End = moment(time1.end);
    const time2Start = moment(time2.start);
    const time2End = moment(time2.end);
    if (time1Start.isBetween(time2Start, time2End) ||
        time1End.isBetween(time2Start, time2End) ||
        time2Start.isBetween(time1Start, time1End) ||
        time2End.isBetween(time1Start, time1End)) {
        return true;
    }
    return false;
}
exports.checkOverLapTime = checkOverLapTime;
function getTheFirstInstance(eventList) {
    if (eventList.length === 0)
        return null;
    if (eventList.length === 1)
        return eventList[0];
    return eventList.sort((a, b) => {
        return new Date(a.id.split('_')[0]).getTime() - new Date(b.id.split('_')[0]).getTime();
    });
}
exports.getTheFirstInstance = getTheFirstInstance;
function date_sort_asc(date1, date2) {
    if (new Date(date1).getTime() >= new Date(date2).getTime()) {
        return 1;
    }
    return -1;
}
exports.date_sort_asc = date_sort_asc;
function date_diff(date1, date2) {
    if (new Date(date1).getTime() !== new Date(date2).getTime()) {
        return {
            status: true,
            value: new Date(date1).getTime() - new Date(date2).getTime()
        };
    }
    return {
        status: false,
        value: 0
    };
}
exports.date_diff = date_diff;
function date_add_milisecond(time, amount) {
    return moment(new Date(time)).add(amount, 'milliseconds').toDate().toISOString();
}
exports.date_add_milisecond = date_add_milisecond;
function getDateOnly(rrule_string) {
    return moment(rrule_string.split('T')[0]).toDate();
}
exports.getDateOnly = getDateOnly;
// Hàm này nhận vào một Event, trả về thời gian trước đó
// Thời gian bị trừ lấy từ trường orginalStartTime
// days: số ngày cần trừ
// unit: đơn vị thời gian cần trừ
function date_substract(date, days, unit) {
    return moment(new Date(date.originalStartTime.date || date.originalStartTime.dateTime))
        .subtract(days, unit || 'days')
        .endOf('day')
        .toDate();
}
exports.date_substract = date_substract;
function date_add(date, days, unit) {
    return moment(new Date(date.originalStartTime.date || date.originalStartTime.dateTime))
        .add(days, unit || 'days')
        .toDate();
}
exports.date_add = date_add;


/***/ }),

/***/ "./apps/api/src/utils/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./apps/api/src/utils/response.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./apps/api/src/utils/helper.ts"), exports);


/***/ }),

/***/ "./apps/api/src/utils/pipe.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventDatePipe = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const controlled_exception_1 = __webpack_require__("./apps/api/src/exception/controlled.exception.ts");
const moment = __webpack_require__("moment-timezone");
let EventDatePipe = class EventDatePipe {
    transform(value) {
        var _a;
        try {
            if (!value.start || !value.end) {
                return value;
            }
            if (new Date(value.start.dateTime) > new Date(value.end.dateTime)) {
                throw new controlled_exception_1.ExceptionBadRequest('start.dateTime must SMALLER than end.dateTime');
            }
            if (new Date(value.start.date) > new Date((_a = value === null || value === void 0 ? void 0 : value.end) === null || _a === void 0 ? void 0 : _a.date)) {
                throw new controlled_exception_1.ExceptionBadRequest('start.date must SMALLER than end.date');
            }
            if ((value.start.dateTime && value.end.date) || (value.start.date && value.end.dateTime)) {
                throw new controlled_exception_1.ExceptionBadRequest('dateTime and date cannot exist used together, one of them must be null');
            }
            if ((!value.start.dateTime && !value.start.date) ||
                (!value.end.dateTime && !value.end.date) ||
                (!value.start && !value.end)) {
                throw new controlled_exception_1.ExceptionBadRequest('start.dateTime or start.date is required');
            }
            value.start.dateTime
                ? (value.start.dateTime = moment(value.start.dateTime).tz('Asia/Ho_Chi_Minh').format())
                : null;
            value.end.dateTime ? (value.end.dateTime = moment(value.end.dateTime).tz('Asia/Ho_Chi_Minh').format()) : null;
            value.start.date
                ? (value.start.date = moment(value.start.date).startOf('day').tz('Asia/Ho_Chi_Minh').format().split('T')[0])
                : null;
            value.end.date
                ? (value.end.date = moment(value.end.date).startOf('day').tz('Asia/Ho_Chi_Minh').format().split('T')[0])
                : null;
            return value;
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
};
EventDatePipe = tslib_1.__decorate([
    (0, common_1.Injectable)()
], EventDatePipe);
exports.EventDatePipe = EventDatePipe;


/***/ }),

/***/ "./apps/api/src/utils/response.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.response = exports.CommonReponse = void 0;
const tslib_1 = __webpack_require__("tslib");
const swagger_1 = __webpack_require__("@nestjs/swagger");
class CommonReponse {
}
tslib_1.__decorate([
    (0, swagger_1.ApiResponseProperty)({ example: 200 }),
    tslib_1.__metadata("design:type", Number)
], CommonReponse.prototype, "code", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiResponseProperty)({ example: 'Error' }),
    tslib_1.__metadata("design:type", String)
], CommonReponse.prototype, "message", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiResponseProperty)({ example: [] }),
    tslib_1.__metadata("design:type", Object)
], CommonReponse.prototype, "data", void 0);
exports.CommonReponse = CommonReponse;
/**
 * response handler
 * @param res
 * @param data
 * @returns
 */
function response(content, code, info) {
    const res = { code: 200, info: 'SUCCESS', content: content || [] };
    if (code)
        res.code = code;
    if (info)
        res.info = info;
    return res;
}
exports.response = response;


/***/ }),

/***/ "@nestjs/common":
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),

/***/ "@nestjs/config":
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),

/***/ "@nestjs/core":
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),

/***/ "@nestjs/jwt":
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),

/***/ "@nestjs/passport":
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),

/***/ "@nestjs/swagger":
/***/ ((module) => {

module.exports = require("@nestjs/swagger");

/***/ }),

/***/ "@nestjs/typeorm":
/***/ ((module) => {

module.exports = require("@nestjs/typeorm");

/***/ }),

/***/ "class-transformer":
/***/ ((module) => {

module.exports = require("class-transformer");

/***/ }),

/***/ "class-validator":
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),

/***/ "cookie-parser":
/***/ ((module) => {

module.exports = require("cookie-parser");

/***/ }),

/***/ "google-auth-library":
/***/ ((module) => {

module.exports = require("google-auth-library");

/***/ }),

/***/ "googleapis":
/***/ ((module) => {

module.exports = require("googleapis");

/***/ }),

/***/ "lodash":
/***/ ((module) => {

module.exports = require("lodash");

/***/ }),

/***/ "moment-timezone":
/***/ ((module) => {

module.exports = require("moment-timezone");

/***/ }),

/***/ "nest-winston":
/***/ ((module) => {

module.exports = require("nest-winston");

/***/ }),

/***/ "passport-jwt":
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),

/***/ "rrule":
/***/ ((module) => {

module.exports = require("rrule");

/***/ }),

/***/ "tslib":
/***/ ((module) => {

module.exports = require("tslib");

/***/ }),

/***/ "typeorm":
/***/ ((module) => {

module.exports = require("typeorm");

/***/ }),

/***/ "winston":
/***/ ((module) => {

module.exports = require("winston");

/***/ }),

/***/ "winston-daily-rotate-file":
/***/ ((module) => {

module.exports = require("winston-daily-rotate-file");

/***/ }),

/***/ "crypto":
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "fs":
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "path":
/***/ ((module) => {

module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const core_1 = __webpack_require__("@nestjs/core");
const customValidation_exception_1 = __webpack_require__("./apps/api/src/exception/customValidation.exception.ts");
const app_module_1 = __webpack_require__("./apps/api/src/app/app.module.ts");
const swagger_1 = __webpack_require__("@nestjs/swagger");
const cookieParser = __webpack_require__("cookie-parser");
const httpFilter_exception_1 = __webpack_require__("./apps/api/src/exception/httpFilter.exception.ts");
function bootstrap() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const app = yield core_1.NestFactory.create(app_module_1.AppModule);
        app.disable('x-powered-by');
        app.useStaticAssets('public');
        const globalPrefix = 'api';
        app.setGlobalPrefix(globalPrefix);
        app.useGlobalPipes(new customValidation_exception_1.CustomeValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
            transformOptions: { enableImplicitConversion: true }
        }));
        const httpAdapterHost = app.get(core_1.HttpAdapterHost);
        app.useGlobalFilters(new httpFilter_exception_1.GlobalExceptionsFilter(httpAdapterHost));
        app.use(cookieParser());
        app.enableCors({
            origin: true,
            credentials: true
        });
        // Global in
        const port = process.env.PORT || 3000;
        const swaggerConfig = new swagger_1.DocumentBuilder().setTitle('Calendar APIs Docs').setVersion('1.0').build();
        const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
        swagger_1.SwaggerModule.setup('api/specs', app, document);
        yield app.listen(port);
        common_1.Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
    });
}
bootstrap();

})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=main.js.map