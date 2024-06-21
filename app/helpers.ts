import Theme, {Theme2} from './Theme';
import {GuestUser, MasterUser} from './DummyData';
import * as AppSettings from "tns-core-modules/application-settings";
import * as HttpModule from 'tns-core-modules/http';
import { chunk } from 'lodash';
import unescape from 'lodash/unescape';
import * as moment from 'moment';

import {Html5Entities} from 'html-entities';

import { ApolloClient } from 'apollo-client';

import { platformNames, screen, isIOS } from 'tns-core-modules/platform/platform';
import { ItemSpec } from 'tns-core-modules/ui/layouts/grid-layout/grid-layout';



const SCREEN_HEIGHT = screen.mainScreen.heightPixels;

export type ViewTypes = {
    SvgUri:any
}

export const getItemSpec = (args:string[]): string => {
    //console.log(args)
    const items:string = args.join(",")

    //console.log(items);

    return items;
}


moment.locale('en', {
    relativeTime : {
        future: "in %s",
        past:   "%s ago",
        s  : 'a few seconds',
        ss : '%d seconds',
        m:  "a minute",
        mm: "%d minutes",
        h:  "an hour",
        hh: "%d hours",
        d:  "a day",
        dd: "%d days",
        M:  "a month",
        MM: "%d months",
        y:  "a year",
        yy: "%d years"
    },
    calendar : {
        lastDay : '[Yesterday ·] LT',
        sameDay : '[Today ·] LT',
        nextDay : '[Tomorrow ·] LT',
        lastWeek : '[Last] ddd [·] LT',
        nextWeek : 'ddd [-] LT',
        sameElse : 'd MMM YYYY'
    }
})

String.prototype.phoneFormat = function () {
    var num = this;
    if (num.length < 9) {
        return this;
    }

    if (num.length === 9) {
        var _num1 = num.slice(0, 2);
        num = num.slice(2)
        var _num2 = num.slice(0, 3);
        num = num.slice(3)
    } else {
        var _num1 = num.slice(0, 3);
        num = num.slice(3)
        var _num2 = num.slice(0, 3);
        num = num.slice(3)
        return _num1 + "-" + _num2 + "-" + num;
    }
}

String.prototype.capitalize = function () {
    var txt = this;
    txt.splice(0);
    return this.charAt(0).toLowerCase() + txt;
}

String.prototype.firstLetter = function () {
    return this.charAt(0)
}

String.prototype.restLetters = function (int = 0) {
    var txt = this;
    txt.splice(int);
    return txt;
}

String.prototype.plural = function (revert) {

    var plural = {
        '(quiz)$': "$1zes",
        '^(ox)$': "$1en",
        '([m|l])ouse$': "$1ice",
        '(matr|vert|ind)ix|ex$': "$1ices",
        '(x|ch|ss|sh)$': "$1es",
        '([^aeiouy]|qu)y$': "$1ies",
        '(hive)$': "$1s",
        '(?:([^f])fe|([lr])f)$': "$1$2ves",
        '(shea|lea|loa|thie)f$': "$1ves",
        'sis$': "ses",
        '([ti])um$': "$1a",
        '(tomat|potat|ech|her|vet)o$': "$1oes",
        '(bu)s$': "$1ses",
        '(alias)$': "$1es",
        '(octop)us$': "$1i",
        '(ax|test)is$': "$1es",
        '(us)$': "$1es",
        '([^s]+)$': "$1s"
    };

    var singular = {
        '(quiz)zes$': "$1",
        '(matr)ices$': "$1ix",
        '(vert|ind)ices$': "$1ex",
        '^(ox)en$': "$1",
        '(alias)es$': "$1",
        '(octop|vir)i$': "$1us",
        '(cris|ax|test)es$': "$1is",
        '(shoe)s$': "$1",
        '(o)es$': "$1",
        '(bus)es$': "$1",
        '([m|l])ice$': "$1ouse",
        '(x|ch|ss|sh)es$': "$1",
        '(m)ovies$': "$1ovie",
        '(s)eries$': "$1eries",
        '([^aeiouy]|qu)ies$': "$1y",
        '([lr])ves$': "$1f",
        '(tive)s$': "$1",
        '(hive)s$': "$1",
        '(li|wi|kni)ves$': "$1fe",
        '(shea|loa|lea|thie)ves$': "$1f",
        '(^analy)ses$': "$1sis",
        '((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$': "$1$2sis",
        '([ti])a$': "$1um",
        '(n)ews$': "$1ews",
        '(h|bl)ouses$': "$1ouse",
        '(corpse)s$': "$1",
        '(us)es$': "$1",
        's$': ""
    };

    var irregular = {
        'move': 'moves',
        'foot': 'feet',
        'goose': 'geese',
        'sex': 'sexes',
        'child': 'children',
        'man': 'men',
        'tooth': 'teeth',
        'person': 'people'
    };

    var uncountable = [
        'sheep',
        'fish',
        'deer',
        'moose',
        'series',
        'species',
        'money',
        'rice',
        'information',
        'equipment'
    ];

    // save some time in the case that singular and plural are the same
    if (uncountable.indexOf(this.toLowerCase()) >= 0)
        return this;

    // check for irregular forms
    for (let word in irregular) {
        //let word = word;
        if (revert) {
            var pattern = new RegExp(irregular[word] + '$', 'i');
            var replace = word;
        } else {
            var pattern = new RegExp(word + '$', 'i');
            var replace = irregular[word];
        }
        if (pattern.test(this))
            return this.replace(pattern, replace);
    }

    let array:any;

    if (revert) array = singular;
    else array = plural;

    // check for matches using regular expressions
    for (let reg in array) {
        //let reg = reg;
        var pattern = new RegExp(reg, 'i');

        if (pattern.test(this))
            return this.replace(pattern, array[reg]);
    }

    return this;
}

interface WrapperTypes{};


platformNames

export function isIphoneX() {
    const dimen = screen;
    return (
        isIOS &&
        ((dimen.mainScreen.heightPixels === 812 || dimen.mainScreen.widthPixels === 812) || (dimen.mainScreen.heightPixels === 896 || dimen.mainScreen.widthPixels === 896))
    );
}

export function ifIphoneX(iphoneXStyle: any, regularStyle: any) {
    if (isIphoneX()) {
        return iphoneXStyle;
    }
    return regularStyle;
}

class _Helper {

    positions = {
        Football: {
            halves: 2,
            positions: [
                "Goalkeeper",
                "Right Fullback",
                "Left Fullback",
                "Center Back",
                "Center Back",
                "Defending",
                "Holding Midfielder",
                "Right Midfielder",
                "Central Midfielder",
                "Striker",
                "Attacking Midfielder",
                "Left Midfielder"
            ]
        },
        Rugby: {
            halves: 2,
            positions: []
        },
        "Field Hockey": {
            halves: 4,
            positions: []
        },
        Netball: {
            halves: 4,
            positions: []
        }
    }

    views:WrapperTypes = {}
    openModals:String[] = [];
    name = "Supotsu-App";
    data = {
        yoo: GuestUser,
        BlockedBySystem: [],
        BlockedByYou: [],
        BlockedForYou: [],
        draftGames : [],
        all_players: [] }
    io:any;
    ApolloClient:ApolloClient<any> = null;
    //mapsKey = 'AIzaSyAYbZXdWpm7E-NCTXh4aeg8lwigeAuXqrY'
    mapsKey = 'AIzaSyAI7NWP3ewOfoMvznQ1582BpZWOiOg36WI';
    chatIO = false;
    _alert = false;
    isSocketOn = false;
    notif = null;
    shareContext = {};
    theme = Theme;
    theme2 = Theme2;
    moment = moment;
    _moment = moment;
    //scale = scale;

    //verticalScale = verticalScale;
    //moderateScale = moderateScale;
    isIphoneX = isIphoneX;
    ifIphoneX = ifIphoneX;
    //getStatusBarHeight = _getStatusBarHeight;
    states = {};
    activeHeaders = {}
    snacks = {};
    callbacks = {};
    chats = [];
    URL = "";
    fetchURL = "https://supotsu.com/server";
    guest = GuestUser;
    admin = MasterUser;
    baseURL = "";
    messaging = false;
    apiURL = `https://supotsu.com`;
    readonly months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July ',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];

    readonly days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    constructor() {

        const _data = AppSettings.getString('fakeDat-beta0', '{}');
        this.data = {
            ...this.data,
            ...JSON.parse(_data)
        }

        const _chats = AppSettings.getString('chats', '[]');
        this.data['chats'] = JSON.parse(_chats);

        this._moment.locale('en', {
            calendar : {
                lastDay : '[Yesterday]',
                sameDay : 'HH:mm',
                nextDay : '[Tomorrow ·] LT',
                lastWeek : 'ddd',
                nextWeek : 'YYYY/M/d',
                sameElse : 'DD MMM'
            }
        })
    }

    now = () => Date.now()

    gameQuarter = (num = 1) => {
        if (num === 1) {
            return num + "st";
        } else if (num === 2) {
            return num + "nd";
        } else if (num === 3) {
            return num + "rd";
        } else{
            return num + "th";
        }
    }

    you = () => {
        return this.data.yoo
    }

    getTaggableUsers = (contentUsers = []) => {
        const array = [];
        array.push(this.you());
        this.you().friends.forEach((item)=>array.push(item))
        contentUsers.forEach((item)=>array.push(this.getUser(item)))
        this.you().clubs.forEach((item)=>array.push({...item, type: 'C'}))
        this.you().ownTeams.forEach((item)=>array.push({...item, type: 'T'}))
        this.you().leagues.forEach((item)=>array.push({...item, type: 'L'}))
        this.you().institutions.forEach((item)=>array.push({...item, type: 'I'}))
        return array;
    }

    getRouteName = (type="F") => {
        let _route = "Profile";

        switch (type) {
            case "T":
                _route = "Team";
                break;
            case "I":
                _route = "Institution";
                break;
            case "C":
                _route = "Club";
                break;
            case "Q":
                _route = "Group";
                break;
            case "L":
                _route = "Tournament";
                break;
            case "G":
                _route = "Game";
                break;
            case "E":
                _route = "Event";
                break;

            default:
                _route = "You";
                break;
        }

        return {
            name: _route,
            type: type,
            withSuffix: _route.plural(false)
        }
    }

    getPageCreateState = (type = "T") => {
        let state = {};
        switch(type){
            case "T":
                state = {
                    team: {
                        name: "",
                        level: "",
                        sport: "",
                        id: null,
                        hash: null,
                        email: "",
                        phone: "",
                        land: "",
                        website: "",
                        location: "",
                        address: "",
                        suburb: "",
                        postal: "",
                        state: "",
                        country: "",
                        ground: "",
                        activeSquad: {
                            entry: 1,
                            age: "",
                            name: "",
                            gender: "",
                            coach: {
                                id: null,
                                name: ""
                            },
                            assCoach: {
                                id: null,
                                name: ""
                            },
                            coachErr: false,
                            assCoachErr: false
                        },
                        squads: [],
                        socials: [],
                        established: "",
                        manager: { id: null, name: "" },
                        secretary: { id: null, name: "" },
                        about: "",
                        otherPeople: [],
                        settings: []
                    },
                    yourRole: {
                        role: ""
                    },
                    confirmee: {
                        name: "",
                        email: ""
                    },
                    othersVerifications: [],
                    levels: ["Amatuer", "Professional", "Semi-Professional"],
                    genders: ["male", "female", "mixed"],
                    roles: ["Captain", "Coach", "Manager", "Player", "Referee", "Staff"],
                    isAddingSports: false,
                    isAddingTeams: false,
                    isAddingPersons: false,
                    canAddTeams: false,
                    isAfterReg: false,
                    phoneErr: false,
                    landErr: false
                };
                break;
            case "I":
                state = {
                    club: {
                        name: "",
                        sport: "",
                        id: null,
                        hash: null,
                        email: "",
                        phone: "",
                        land: "",
                        website: "",
                        location: "",
                        address: "",
                        suburb: "",
                        postal: "",
                        state: "",
                        country: "",
                        teams: [],
                        sports: [],
                        socials: [],
                        established: "",
                        manager: { id: null, name: "" },
                        secretary: { id: null, name: "" },
                        about: "",
                        otherPeople: [],
                        sportPersons: [],
                        settings: []
                    },
                    yourRole: {
                        role: ""
                    },
                    confirmee: {
                        name: "",
                        email: ""
                    },
                    othersVerifications: [],
                    roles: ["Head of sport department", "Assistant head of sport department", "Offer of sport department", "Director of sport department", "Assistant director of sport department", "Officer of a sport", "Head coach", "Assistant head coach", "Team captian", "Team player", "Student"],
                    isAddingSports: false,
                    isAddingTeams: false,
                    isAddingPersons: false,
                    canAddTeams: false,
                    isAfterReg: false,
                    phoneErr: false,
                    landErr: false
                };
                break;
            case "C":
                state = {
                    club: {
                        name: "",
                        level: "",
                        id: null,
                        hash: null,
                        email: "",
                        phone: "",
                        land: "",
                        website: "",
                        location: "",
                        address: "",
                        suburb: "",
                        postal: "",
                        state: "",
                        country: "",
                        teams: [],
                        sports: [],
                        socials: [],
                        established: "",
                        manager: { id: null, name: "" },
                        secretary: { id: null, name: "" },
                        about: "",
                        otherPeople: [],
                        settings: []
                    },
                    yourRole: {
                        role: ""
                    },
                    confirmee: {
                        name: "",
                        email: ""
                    },
                    othersVerifications: [],
                    levels: ["Amatuer", "Professional", "Semi-Professional"],
                    roles: ["Admin Secretary", "Captain", "Chairman", "CFO", "CEO", "Coach", "COO", "Managing Director", "Player", "Referee", "Receptionist ", "Score Keeper", "Staff Admin"],
                    isAddingSports: false,
                    isAddingTeams: false,
                    canAddTeams: false,
                    isAfterReg: false,
                    phoneErr: false,
                    landErr: false
                };
                break;
            case "Q":
                state = {

                };
                break;
            case "L":
                state = {
                    tourn: {
                        name: "",
                        sport: "",
                        id: null,
                        hash: null,
                        level: "",
                        type: "",
                        email: "",
                        phone: "",
                        land: "",
                        gender: "",
                        website: "",
                        location: "",
                        address: "",
                        suburb: "",
                        postal: "",
                        state: "",
                        country: "",
                        teams: [],
                        socials: [],
                        established: "",
                        manager: { id: null, name: "" },
                        secretary: { id: null, name: "" },
                        about: "",
                        roles: [],
                        settings: []
                    },
                    yourRole: {
                        role: ""
                    },
                    confirmee: {
                        name: "",
                        email: ""
                    },
                    othersVerifications: [],
                    levels: ["Amatuer", "Professional", "Semi-Professional"],
                    types: [
                        "league",
                        "group_knockout",
                        "knockout"
                    ],
                    genders: ["male", "female", "mixed"],
                    roles: ["President", "Vice President", "Secretary", "Governing Body", "Council Memeber", "Public Relations", "Finance", "General Administration", "Executive Committee", "Chairman", "Vice Chairman"],
                    isAddingSports: false,
                    isAddingTeams: false,
                    isAddingPersons: false,
                    canAddTeams: false,
                    isAfterReg: false,
                    phoneErr: false,
                    landErr: false,
                    isSet: true
                };
                break;
            case "G":
                state = {

                };
                break;
            case "E":
                state = {

                };
                break;

            default:
                state = {};
                break;
        }

        return state;
    }

    extention = (filename = 'supotsu.app') => {
        return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined;
    }

    getData = (key = "yoo") => {
        if (key == "yoo") {
            return this.data.yoo
        }
        return this.data[key];
    }

    setData = async (key: string | number, data: any, cb:any = false) => {
        this.data[key] = data;
        AppSettings.setString("fakeDat-beta0", JSON.stringify(this.data));
        if(cb)cb();
    }

    hexToRgb = (hex: string) => {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function (m: any, r: any, g: any, b: any) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    post = (path: string, _data: any, callbacks:{
        headers?:any,
        method?:string,
        success?(res:any):void,
        error?(err:any):void
    } = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success() { },
        error() { }
    }) => {
        //alert('res')
        console.log(`Request to ${path}`)
        const _that = this;
        let data = _data;
        data['reqOwner'] = {
            id: this.getData("yoo").id,
            _id: this.getData("yoo")._id,
            type: "F",
            name: this.getData("yoo").name,
            email: this.getData("yoo").email
        }

        var url = (this.isWebsite(path)) ? path : "https://supotsu.com/php/server" + path;
        const headers = callbacks.headers ? callbacks.headers : {
            'Content-Type': 'application/x-www-form-urlencoded'
        };

        //headers['Authentication'] = `Basic ${global.btoa(this.getData("yoo").username+":"+this.getData("yoo"))}`

        const method = callbacks.method ? this.nullify(callbacks.method) : "POST"
        const _body = _that.stringify(data);
        var proxyUrl = '';
/*
        fetch(proxyUrl + url, {
            headers,
            method,
            body: _body
        }).then((r) => {
            console.log("DOME:")
            return r.json()
        }).then((data_)=>{
            console.log(data_)
            if (callbacks.success) {
                callbacks.success(data_)
            }
        }).catch((err:any)=>{
            console.log('ERROR : ', err)
            //console.log(form_data)
            if (callbacks.error) {
                callbacks.error({
                    message: err.message,
                    error: true,
                    statusCode: 404
                })
            }
        })*/

        HttpModule.request({
            url: proxyUrl + url,
            method,
            headers,
            content: _body
        }).then((value)=>{
            //alert('Done')
            console.log(`DONE: ${value.content.toString()}`);
            const data_ = value.content.toJSON();
            if (callbacks.success) {
                callbacks.success(data_)
            }
        }).catch((err)=>{
            console.log('ERROR : ', err)
            //console.log(form_data)
            if (callbacks.error) {
                callbacks.error({
                    message: err.message,
                    error: true,
                    statusCode: 404
                })
            }
        }).finally(()=>{
            console.log(`ReqDone on ${path}`)
        });
    }

    checkStatus = (response:any) => {
        if (response.status >= 200 && response.status < 300) {
            return response
        } else {
            var error:any = new Error(response.statusText)
            error.response = response
            throw error
        }
    }

    parseJSON = (response: { json: () => any; }) => {
        return response.json()
    }

    getQueries = (str: string) => {
        var obj = {};
        var array = str.slice(1).split("&");
        for (var x = 0; x < array.length; x++) {
            var strOf = array[x].split("=");
            obj[strOf[0]] = unescape(strOf[1]);
        }

        return obj;
    }

    getUser = (user = { type: 'F', F: {}}) => {
        const {type} = user;
        return user[type]?user[type]:this.you();
    }

    isEmail = (email: string) => {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    isWebsite = (website: string) => {
        var WEB_REGEXP = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");
        return WEB_REGEXP.test(website);
    }

    isPhone = (phone: string) => {
        var PHONE_REGEXP = /\(?([0-9]{2,3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
        return PHONE_REGEXP.test(phone);
    }

    listify = (list: any) => {
        if (Array.isArray(list)) {
            return list;
        } else {
            return [];
        }
    }

    nullify = (string: any) => {
        const _string = new String(string);
        const _str = new Html5Entities()
        return _str.decode(_string as string);
    }

    getUrl = (url: string, domainOnly = false) => {
        var parse_url = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
        var parts = parse_url.exec( url );
        var result = domainOnly?parts[3].replace(/www./, ''):parts[1]+':'+parts[2]+parts[3]+'/' ;
        return result;
    }

    isToday = (date: string | number | Date) => {
        var td = date instanceof Date ? date : new Date(date);
        var d = new Date();
        return td.getDate() == d.getDate() && td.getMonth() == d.getMonth() && td.getFullYear() == d.getFullYear();
    }

    pad = (num: string) => {
        return ("0"+num).slice(-2);
    }

    is24 = (date = "") => {
        var date1 = new Date(date);
        var timeStamp = Math.round(new Date().getTime() / 1000);
        var timeStampYesterday = timeStamp - (24 * 3600);
        var is24 = date1.getTime() >= new Date(timeStampYesterday).getTime();

        return is24;
    }

    isWeek = (date = "") => {
        var date1 = new Date(date);
        var timeStamp = Math.round(new Date().getTime() / 1000);
        var day = (24 * 3600);
        var week = day * 7;
        var timeStampYesterday = timeStamp - week;
        var is24 = date1.getTime() >= new Date(timeStampYesterday).getTime();

        return is24;
    }

    makeid = (len: number) => {
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		for (var i = 0; i < len; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
    }

    alert = (text:any) => {
        alert(text);
    }

    shared = (key:string, context?:any) => {
		var isContext = Boolean(context)
		if (!isContext) {
			return this.shareContext[key]
		} else {
			this.shareContext[key] = context
			return this
		}
    }

    getAcountType = (type = "F") => {
        let _type = "Profile";
        switch (type) {
            case "F":
                _type = "Profile"
                break;
            case "C":
                _type = "Club"
                break;
            case "T":
                _type = "Team"
                break;
            case "L":
                _type = "Tournament"
                break;
            case "I":
                _type = "Institution"
                break;
            case "E":
                _type = "Event"
                break;

            case "G":
                _type = "Game"
                break;

            case "Q":
                _type = "Game"
                break;

            default:
                _type = "Profile"
                break;
        }

        return _type;
    }

    getDateFrom = (givenDate:any, agoOnly = false) => {
        const TIME_ZONE = -1 * new Date().getTimezoneOffset() / 60;
        const is24 = agoOnly?true:this.isWeek(givenDate);
        //@ts-ignore
        return !is24?moment(givenDate).add(TIME_ZONE, "hours").calendar():moment(givenDate)
            .fromNow();
    }

    getDateCalFormat = (givenDate = "") => {
        const TIME_ZONE = -1 * new Date().getTimezoneOffset() / 60;
        //@ts-ignore
        return moment(givenDate).add(TIME_ZONE, "hours").calendar()
    }

    getTimeCalFormat = (givenDate = "", min = 15) => {
        const TIME_ZONE = -1 * new Date().getTimezoneOffset() / 60;
        //@ts-ignore
        return moment(givenDate).add(TIME_ZONE, "hours").subtract(min, 'minutes').format("h:mm a")
    }

    hhmmss = (secs: number) => {
        //secs = secs * 60;
        var minutes = Math.floor(secs / 60);
        secs = secs%60;
        var hours = Math.floor(minutes/60)as unknown as string
        minutes = minutes%60;
        return this.pad(hours)+":"+this.pad(minutes as unknown as string)+":"+this.pad(secs as unknown as string);
    }

    msToHMS = ( seconds = 0 ) => {
        var duration = this.moment.duration(seconds, 'seconds');
        var min = duration.asMinutes() as unknown as string;
        var secs = duration.asSeconds()as unknown as string;
        var hour = duration.asHours()as unknown as string;
        return this.pad(hour)+":"+this.pad(min)+":"+this.pad(secs);;
    }

    msToTime = (s: number) => {
        var ms = s % 1000;
        s = (s - ms) / 1000;
        var secs = s % 60;
        s = (s - secs) / 60;
        var mins = s % 60;
        var hrs = (s - mins) / 60;

        return hrs + ':' + mins + ':' + secs + '.' + ms;
    }

    show = (s: string | number) => {
      var d = new Date();
      var d1 = new Date(d.getTime()+parseInt(s as unknown as string)*1000);
      var  hms = this.hhmmss(s as unknown as number);
      return (s+"s = "+ hms + " - "+ Math.floor((d1.getTime()-d.getTime())/1000)+"\n"+d.toString().split("GMT")[0]+"\n"+d1.toString().split("GMT")[0]);
    }

    /**
      * Find element in array list.
      * @param needle search element.
      * @param haystack list of items
      * @param argStrict ...
      */

    inArray = (needle:any, haystack:any, argStrict?:any) => {
        var key = '',
            strict = !!argStrict;

        if (strict) {
            for (key in haystack) {
                if (haystack[key] === needle) {
                    return true;
                }
            }
        } else {
            for (key in haystack) {
                if (haystack[key] == needle) {
                    return true;
                }
            }
        }

        return false;
    }

    capitalize = (lower = '') => {
        var upper = lower.charAt(0).toUpperCase() + lower.substr(1);
        return upper;
    }

    _getBlocked = (id: any, type: any, arr = []) => {
		const _list = arr.filter((item) => {
			return item.user_id === id && item.user_type === type;
		});

		return _list.length > 0 ? true : false;
	}

	getBlocked = (context: { props: any; }, objOnly = true, types = [], blockTypes = []) => {
		const { props } = context;
		if (objOnly) {
			return {
				BlockedBySystem: this.listify(props['BlockedBySystem'] ? props['BlockedBySystem'] : this.getData('BlockedBySystem')),
				BlockedByYou: this.listify(props['BlockedByYou'] ? props['BlockedByYou'] : this.getData('BlockedByYou')),
				BlockedForYou: this.listify(props['BlockedForYou'] ? props['BlockedForYou'] : this.getData('BlockedForYou'))
			};
		} else {
			const _list = [];
			const _obj = {
				BlockedBySystem: this.listify(props['BlockedBySystem'] ? props['BlockedBySystem'] : this.getData('BlockedBySystem')),
				BlockedByYou: this.listify(props['BlockedByYou'] ? props['BlockedByYou'] : this.getData('BlockedByYou')),
				BlockedForYou: this.listify(props['BlockedForYou'] ? props['BlockedForYou'] : this.getData('BlockedForYou'))
			};

			_obj.BlockedBySystem.forEach((item) => {
				if (this.inArray(item.user_type, types) && !this.inArray(item.user_id, _list) && !(blockTypes.length > 0 && !this.inArray(item.type, blockTypes))) {
					_list.push(item.user_id);
				}
			})

			_obj.BlockedByYou.forEach((item) => {
				if (this.inArray(item.user_type, types) && !this.inArray(item.user_id, _list) && !(blockTypes.length > 0 && !this.inArray(item.type, blockTypes))) {
					_list.push(item.user_id);
				}
			})

			_obj.BlockedForYou.forEach((item) => {
				if (this.inArray(item.user_type, types) && !this.inArray(item.user_id, _list) && !(blockTypes.length > 0 && !this.inArray(item.type, blockTypes))) {
					_list.push(item.user_id);
				}
			})

			return _list;
		}
    }

    nFormatter = (num: number, digits = 1) => {
        var si = [
            { value: 1E18, symbol: "E" },
            { value: 1E15, symbol: "P" },
            { value: 1E12, symbol: "T" },
            { value: 1E9, symbol: "G" },
            { value: 1E6, symbol: "M" },
            { value: 1E3, symbol: "k" }
        ], rx = /\.0+$|(\.[0-9]*[1-9])0+$/, i: number;

        for (i = 0; i < si.length; i++) {
            if (num >= si[i].value) {
                return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
            }
        }
        return num.toFixed(digits).replace(rx, "$1");
    }

    getRandomInt = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    toMyTimezone = (dateString: string | number | Date) => {
        var myDate = new Date(dateString);
        var date = new Date();
        if (myDate.getTimezoneOffset() === date.getTimezoneOffset()) {
            //return myDate;
            myDate.setMinutes(myDate.getMinutes() + myDate.getTimezoneOffset());
            return myDate;
        }
        myDate.setMinutes(myDate.getMinutes() - myDate.getTimezoneOffset());
        return myDate;
    }

    today = () => {
        var date = new Date();
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        return {
            fullDate: this.days[date.getDay()] + ", " + date.getDate() + " " + this.months[date.getMonth()] + " " + date.getFullYear(),
            context: {
                months: this.months,
                days: this.days,
                dateObj: date
            }
        };
    }

    shortDigit = (num: any, suffix = "") => {
        const _num = this.numify(num);
        const _suffix = this.nullify(suffix).toLowerCase();
        const _text = parseInt(this.nFormatter(_num)) === 0 ? "" : this.nFormatter(_num) + " ";
        const _ext = parseInt(this.nFormatter(_num)) === 0 ? this.capitalize(_suffix) : parseInt(this.nFormatter(_num)) === 1 ? _suffix : _suffix === "" ? _suffix : _suffix.plural();
        const value = {
            text: this.nFormatter(_num, 1),
            isSingle: (_num / 6) > 1000000 ? false : ((_num / 3) > 1000) ? false : (_num === 1) ? true : (_num === 0) ? false : false,
            data: _text + "" + _ext
        }

        return value;
    }

    getRichText = (txt = "", arr: { [x: string]: { [x: string]: any; }; }) => {
        //const _content;
        let text = txt;
        if (arr instanceof Array || !arr) {
            return txt;
        } else {
            const Keys = Object.keys(arr);
            Keys.forEach((key) => {
                if (arr[key]) {
                    const _list = this.getBlocked({ props: {} }, false, [arr[key]['type']]);
                    const _isBlocked = (this.inArray(arr[key]['id'], _list)) ? true : false;
                    const _link = _isBlocked ? "<a class=\"disabled\"><b>" + arr[key]['name'] + "</b></a>" : `<a href="${"/profile/" + arr[key]['user'] + "?sInit=about"}"><b>${arr[key]['name']}</b></a>`
                    const content = (_isBlocked ? `<i class="material-icons" style="font-size:10px;margin:0px 2px 0px 5px">block</i>` : "") + _link;
                    const _replace = "%" + key + "%";
                    text = text.replace(_replace, content);
                }
            })

            return text;
        }
    }

    getSettingValue = (tag = "", settings = [], returnType = "bool") => {
        let bool = returnType === "bool" ? true : "Friends";
        settings.forEach((item) => {
            if (item.sub === tag) {
                bool = item.value;
            }
        });

        return bool;
    }

    ___ = (type:any = false, config = {}, profile = GuestUser) => {
		let __config = {};
		const _ = Object.keys(config);

		if (profile.isAdmin || !type || type === "G") {
			_.forEach((item) => {
				__config[item] = true;
			})

			return __config;
		};

		this.listify(profile.settings).forEach((item:any) => {
			if (config[item.sub]) {
				const _bool = (typeof item.value === "string" || typeof config[item.sub] === "string") ? true : false;
				if (_bool) {
					__config[item.sub] = (!profile.isFriend && item.value === "Friends") ? false : (item.value === "Public") ? true : false;
				} else {
					if (Array.isArray(config[item.sub])) {
						__config[item.sub] = item.users;
					} else {
						__config[item.sub] = item.value;
					}
				}
			}
		})

		_.forEach((item) => {
			if (!__config[item]) {
				__config[item] = typeof config[item] === "string" ? true : false;
			}
		})

		return __config;
	}

    numify = (num: string) => {
        return parseInt(num);
    }

    support = () => {
        return {
            email: "9409promos@gmail.com"
        }
    }

    SHA1 = (msg = "") => {
        function rotate_left(n: number, s: number) {
            var t4 = (n << s) | (n >>> (32 - s));

            return t4;
        }


        function cvt_hex(val: number) {
            var str = "";

            var i: number;

            var v: number;

            for (i = 7; i >= 0; i--) {
                v = (val >>> (i * 4)) & 0x0f;

                str += v.toString(16);
            }

            return str;
        }

        function Utf8Encode(string: string) {
            string = string.replace(/\r\n/g, "\n");

            var utftext = "";

            for (var n = 0; n < string.length; n++) {
                var c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if (c > 127 && c < 2048) {
                    utftext += String.fromCharCode((c >> 6) | 192);

                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);

                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);

                    utftext += String.fromCharCode((c & 63) | 128);
                }
            }

            return utftext;
        }

        var blockstart: number;

        var i: number, j: number;

        var W = new Array(80);

        var H0 = 0x67452301;

        var H1 = 0xefcdab89;

        var H2 = 0x98badcfe;

        var H3 = 0x10325476;

        var H4 = 0xc3d2e1f0;

        var A: number, B: number, C: number, D: number, E: number;

        let temp:any;

        msg = Utf8Encode(msg);

        var msg_len = msg.length;

        var word_array = new Array();

        for (i = 0; i < msg_len - 3; i += 4) {
            j =
                (msg.charCodeAt(i) << 24) |
                (msg.charCodeAt(i + 1) << 16) |
                (msg.charCodeAt(i + 2) << 8) |
                msg.charCodeAt(i + 3);

            word_array.push(j);
        }

        switch (msg_len % 4) {
            case 0:
                i = 0x080000000;

                break;

            case 1:
                i = (msg.charCodeAt(msg_len - 1) << 24) | 0x0800000;

                break;

            case 2:
                i =
                    (msg.charCodeAt(msg_len - 2) << 24) |
                    (msg.charCodeAt(msg_len - 1) << 16) |
                    0x08000;

                break;

            case 3:
                i =
                    (msg.charCodeAt(msg_len - 3) << 24) |
                    (msg.charCodeAt(msg_len - 2) << 16) |
                    (msg.charCodeAt(msg_len - 1) << 8) |
                    0x80;

                break;
        }

        word_array.push(i);

        while (word_array.length % 16 != 14) word_array.push(0);

        word_array.push(msg_len >>> 29);

        word_array.push((msg_len << 3) & 0x0ffffffff);

        for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {
            for (i = 0; i < 16; i++) W[i] = word_array[blockstart + i];

            for (i = 16; i <= 79; i++)
                W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);

            A = H0;

            B = H1;

            C = H2;

            D = H3;

            E = H4;

            for (i = 0; i <= 19; i++) {
                temp =
                    (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5a827999) &
                    0x0ffffffff;

                E = D;

                D = C;

                C = rotate_left(B, 30);

                B = A;

                A = temp;
            }

            for (i = 20; i <= 39; i++) {
                temp =
                    (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ed9eba1) & 0x0ffffffff;

                E = D;

                D = C;

                C = rotate_left(B, 30);

                B = A;

                A = temp;
            }

            for (i = 40; i <= 59; i++) {
                temp =
                    (rotate_left(A, 5) +
                        ((B & C) | (B & D) | (C & D)) +
                        E +
                        W[i] +
                        0x8f1bbcdc) &
                    0x0ffffffff;

                E = D;

                D = C;

                C = rotate_left(B, 30);

                B = A;

                A = temp;
            }

            for (i = 60; i <= 79; i++) {
                temp =
                    (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xca62c1d6) & 0x0ffffffff;

                E = D;

                D = C;

                C = rotate_left(B, 30);

                B = A;

                A = temp;
            }

            H0 = (H0 + A) & 0x0ffffffff;

            H1 = (H1 + B) & 0x0ffffffff;

            H2 = (H2 + C) & 0x0ffffffff;

            H3 = (H3 + D) & 0x0ffffffff;

            H4 = (H4 + E) & 0x0ffffffff;
        }

        temp =
            cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);

        return temp.toLowerCase();
    }

    stringify = (obj?:any, replacer?:any, spaces?:any, cycleReplacer?:any) => {
        return JSON.stringify(obj, this.serializer(replacer, cycleReplacer), spaces)
    }

    isYou = (id = 0) => this.you().id === id?true:false;

    serializer = (replacer: { call: (arg0: any, arg1: any, arg2: any) => any; }, cycleReplacer: { (key: any, value: any): string; call?: any; }) => {
        var stack = [], keys = []

        if (cycleReplacer == null) cycleReplacer = function (key: any, value: any) {
            if (stack[0] === value) return "[Circular ~]"
            return "[Circular ~." + keys.slice(0, stack.indexOf(value)).join(".") + "]"
        }

        return function (key: any, value: any) {
            if (stack.length > 0) {
                var thisPos = stack.indexOf(this)
                ~thisPos ? stack.splice(thisPos + 1) : stack.push(this)
                ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key)
                if (~stack.indexOf(value)) value = cycleReplacer.call(this, key, value)
            }
            else stack.push(value)

            return replacer == null ? value : replacer.call(this, key, value)
        }
    }

    uniqid = () => (new Date().getTime()).toString(16);
}

const Helper = new _Helper();

export default Helper;
