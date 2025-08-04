// Название версии (папка, где будут лежать скрипты и стили Сайта)
var siteVersion = '4.29.1';

// Название версии (папка, где будут лежать скрипты и стили Шапки и Футера)
var headerVersion = '1.2.1';

// Название версии (папка, где будут лежать скрипты и стили для clickStream)
var clickStreamVersion = '1.2.0';

var contentWidgetVersion = "1.0.3";

// Название версии (папка, где будут лежать скрипты и стили для Регистрации)
var registrationVersion = '1.1.4';

var contentVersion = '1.0.1';

// Название версии (папка, где будут лежать скрипты и стили для VIP-промо)
var vipPromoVersion = '1.0.1';

// Название версии (папка, где будут лежать скрипты и стили для Фрейма регистрации)
var registrationFrameVersion = '1.4.1';

// Название версии (папка, где будут лежать скрипты и стили для Фрейма регистрации)
var identFrameVersion = '1.1.6';

// Название версии (папка, где будут лежать скрипты и стили для GetApps)
var getAppsVersion = '1.1.1';

// Название версии (папка, где будут лежать скрипты и стили для prepareProcessDevRun)
var prepareProcessDevRunVersion = '1.0.0';

// Название версии (папка, где будут лежать скрипты и стили для Универсального Виджета Регистрации)
var registrationWidgetVersion = '1.11.4';

// Название версии (папка, где будут лежать скрипты и стили для Страницы отписки)
var unsubscribePageVersion = '1.0.1';

// Название версии (папка, где будут лежать скрипты и стили для email Web view)
var mailingWebViewVersion = '1.0.2';

var saveGAClientIdToAdvertInfo = true;

// Версия фрейма капчи
var captchaFrameVersion = '1.0.0';

// Алиас сайта
var siteAlias = 'by5000';

var urlsConfig = {
	// Адрес CDN для подключения статики
	cdnUrl: "//origin.by0e87-resources.by",

	// Путь к скрипту по загрузке статики
	loader: "webStaticBY/fon/loader.clickStream.4.min.js",

	// Путь к скрипту по загрузке статики для GetApps
	getAppsLoader: "webStaticBY/getApps/loader.min.js",
	// Путь к папке со статикой для GetApps (на CDN)
	getAppsPath: 'webStaticBY/getApps',

	// Путь к скрипту по загрузке статики для Фрейма капчи
	captchaFrameLoader: "webStaticBY/captcha/loader.captcha.min.js",
	// Путь к папке со статикой для Фрейма капчи (на CDN)
	captchaFramePath: 'webStaticBY/captcha',

	// Путь к скрипту по загрузке статики
	registrationFrameLoader: "webStaticBY/registrationFrame/loader.registration.min.js",
	// Путь к папке со статикой для Фрейма регистрации (на CDN)
	registrationFramePath: 'webStaticBY/registrationFrame',

	// Путь к скрипту по загрузке статики для Фрейма идентификации
	identFrameLoader: "webStaticBY/identFrame/loader.ident.min.js?ver=1",
	// Путь к папке со статикой для Фрейма идентификации (на CDN)
	identFramePath: 'webStaticBY/identFrame',

	// Путь к скрипту по загрузке статики для Универсального Виджета Регистрации
	registrationWidgetLoader: "webStaticBY/registrationWidget/loader.min.js",
	// Путь к папке со статикой для Универсального Виджета Регистрации (на CDN)
	registrationWidgetPath: 'webStaticBY/registrationWidget',

	// prepareProcessDevRun
	prepareProcessDevRunLoader: 'webStaticCommon/prepareProcessDevRun/loader.min.js',
	prepareProcessDevRunPath: 'webStaticCommon/prepareProcessDevRun',

	// Путь к скрипту по загрузке статики для Страницы отписки
	unsubscribePageLoader: "webStaticBY/unsubscribePage/loader.min.js",
	// Путь к папке со статикой для Регистрации (на CDN)
	unsubscribePagePath: 'webStaticBY/unsubscribePage',

	// Путь к скрипту по загрузке статики для email Web view
	mailingWebViewLoader: "webStaticCommon/mailingWebViewPage/loader.min.js",
	// Путь к папке со статикой для email Web view (на CDN)
	mailingWebViewPath: 'webStaticCommon/mailingWebViewPage',

	// Путь к скрипту по загрузке статики для VIP-промо
	vipPromoLoader: 'webStaticBY/loyalty/vipPromo/loader.min.js',
	// Путь к папке со статикой для VIP-промо (на CDN)
	vipPromoPath: 'webStaticBY/loyalty/vipPromo',

	// Путь к скрипту по загрузке статики для Кликстрима
	clickStreamLoader: "webStaticBY/clickStream/loader.min.js",

	// Путь к скрипту по загрузке чата
	chatLoader: "webStaticBY/fon/chat.loader.js",

	// Путь к скрипту по загрузке аналитики
	analyticsLoader: "webStaticBY/fon/analytics.loader.js?v=2",

	// Путь к скрипту по загрузке статики для Регистрации
	contentWidgetLoader: "webStaticBY/contentWidget/loader.min.js",

	// Путь к папке со статикой для Виджета Контента (на CDN)
	contentWidgetPath: 'webStaticBY/contentWidget',

	// Путь к скрипту по загрузке статики для Регистрации
	registrationLoader: "webStaticBY/registration/loader.min.js",

	// Путь к папке со статикой для Регистрации (на CDN)
	registrationPath: 'webStaticBY/registration',

	// Путь к папке со статикой для Шапки и Футера (на CDN)
	headerPath: "webStaticBY/header",

	// Путь к папке со статикой для Сайта (на CDN)
	webSitePath: "webStaticBY/fon",

	// Путь к папке со статикой для clickStream (на CDN)
	clickStreamPath: 'webStaticBY/clickStream',

	// Путь к папке со статикой для Киберспорта (на CDN)
	esportBYPath: 'webStaticBY/esport',
	esportEmbedPath: 'webStaticBY/esport',

	// Путь к папке со статикой для announcement (на CDN)
	announcement: 'webStaticCommon/loyalty/universal/landings/announcement',

	// Путь к скрипту по загрузке статики для announcement
	announcementLoader: 'webStaticCommon/loyalty/universal/landings/announcement/loader.min.js',

	// Путь к папке со статикой для beFirst (на CDN)
	beFirst: 'webStaticCommon/loyalty/universal/landings/beFirst',

	// Путь к скрипту по загрузке статики для beFirst
	beFirstLoader: 'webStaticCommon/loyalty/universal/landings/beFirst/loader.min.js',

	// Путь к папке со статикой для betBattleSe (на CDN)
	betBattleSe: 'webStaticCommon/loyalty/universal/landings/betBattleSe',

	// Путь к скрипту по загрузке статики для betBattleSe
	betBattleSeLoader: 'webStaticCommon/loyalty/universal/landings/betBattleSe/loader.min.js',

	// Путь к папке со статикой для betCounter (на CDN)
	betCounter: 'webStaticCommon/loyalty/universal/landings/betCounter',

	// Путь к скрипту по загрузке статики для betCounter
	betCounterLoader: 'webStaticCommon/loyalty/universal/landings/betCounter/loader.min.js',

	// Путь к папке со статикой для betTimer2d (на CDN)
	betTimer2d: 'webStaticCommon/loyalty/universal/landings/betTimer2d',

	// Путь к скрипту по загрузке статики для betTimer2d
	betTimer2dLoader: 'webStaticCommon/loyalty/universal/landings/betTimer2d/loader.min.js',

	// Путь к папке со статикой для betTimerLuckyNumber (на CDN)
	betTimerLuckyNumber: 'webStaticCommon/loyalty/universal/landings/betTimerLuckyNumber',

	// Путь к скрипту по загрузке статики для betTimerLuckyNumber
	betTimerLuckyNumberLoader: 'webStaticCommon/loyalty/universal/landings/betTimerLuckyNumber/loader.min.js',

	// Путь к папке со статикой для cashBack (на CDN)
	cashBack: 'webStaticCommon/loyalty/universal/landings/cashBack',

	// Путь к скрипту по загрузке статики для cashBack
	cashBackLoader: 'webStaticCommon/loyalty/universal/landings/cashBack/loader.min.js',

	// Путь к папке со статикой для lostAmountCashBackByPromoCodeSe (на CDN)
	lostAmountCashBackByPromoCodeSe: 'webStaticCommon/loyalty/universal/landings/lostAmountCashBackByPromoCodeSe',

	// Путь к скрипту по загрузке статики для lostAmountCashBackByPromoCodeSe
	lostAmountCashBackByPromoCodeSeLoader: 'webStaticCommon/loyalty/universal/landings/lostAmountCashBackByPromoCodeSe/loader.min.js',

	// Путь к папке со статикой для roulette2d (на CDN)
	roulette2d: 'webStaticCommon/loyalty/universal/landings/roulette2d',

	// Путь к скрипту по загрузке статики для roulette2d
	roulette2dLoader: 'webStaticCommon/loyalty/universal/landings/roulette2d/loader.min.js',

	// Путь к папке со статикой для rouletteSe (на CDN)
	rouletteSe: 'webStaticCommon/loyalty/universal/landings/rouletteSe',

	// Путь к скрипту по загрузке статики для rouletteSe
	rouletteSeLoader: 'webStaticCommon/loyalty/universal/landings/rouletteSe/loader.min.js'
};

// Название версии (папка, где будут лежать скрипты и стили для announcement)
var announcementVersion = '1.0.3';

// Название версии (папка, где будут лежать скрипты и стили для beFirst)
var beFirstVersion = '1.2.10';

// Название версии (папка, где будут лежать скрипты и стили для betBattleSe)
var betBattleSeVersion = '1.1.12';

// Название версии (папка, где будут лежать скрипты и стили для betCounter)
var betCounterVersion = '1.0.2';

// Название версии (папка, где будут лежать скрипты и стили для betTimer2d)
var betTimer2dVersion = '1.0.4';

// Название версии (папка, где будут лежать скрипты и стили для betTimerLuckyNumber)
var betTimerLuckyNumberVersion = '1.2.59';

// Название версии (папка, где будут лежать скрипты и стили для cashBack)
var cashBackVersion = '1.0.17';

// Название версии (папка, где будут лежать скрипты и стили для lostAmountCashBackByPromoCodeSe)
var lostAmountCashBackByPromoCodeSeVersion = '1.1.2';

// Название версии (папка, где будут лежать скрипты и стили для roulette2d)
var roulette2dVersion = '1.0.1';

// Название версии (папка, где будут лежать скрипты и стили для rouletteSe)
var rouletteSeVersion = '1.0.2';
