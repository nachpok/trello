import usersJson from "../../JSON/user.json";
import boardsJson from "../../JSON/board-info.json";

const boardLabelsArray = [
  // { color: "subtle green", bgColor: "#baf3db" },
  { color: "green", bgColor: "#4bce97", isBase: true },
  // { color: "bold green", bgColor: "#1f845a", },

  // { color: "subtle yellow", bgColor: "#f8e6a0" },
  { color: "yellow", bgColor: "#f5cd47", isBase: true },
  // { color: "bold yellow", bgColor: "#946f01", },

  // { color: "subtle orange", bgColor: "#fedec8" },
  { color: "orange", bgColor: "#fea362", isBase: true },
  // { color: "bold orange", bgColor: "#c25100", },

  // { color: "subtle red", bgColor: "#ffd5d2" },
  { color: "red", bgColor: "#f87168", isBase: true },
  // { color: "bold red", bgColor: "#c9372c", },

  // { color: "subtle purple", bgColor: "#dfd8fd" },
  { color: "purple", bgColor: "#9f8fef", isBase: true },
  // { color: "bold purple", bgColor: "#6e5dc6", },

  // { color: "subtle blue", bgColor: "#cce0ff" },
  { color: "blue", bgColor: "#579dff", isBase: true },
  // { color: "bold blue", bgColor: "#0c66e4", },

  // { color: "subtle sky", bgColor: "#c6edfb" },
  { color: "sky", bgColor: "#6cc3e0", isBase: true },
  // { color: "bold sky", bgColor: "#227d9b", },

  // { color: "subtle lime", bgColor: "#d3f1a7" },
  { color: "lime", bgColor: "#94c748", isBase: true },
  // { color: "bold lime", bgColor: "#5b7f24", },

  // { color: "subtle pink", bgColor: "#fdd0ec" },
  { color: "pink", bgColor: "#e774bb", isBase: true },
  // { color: "bold pink", bgColor: "#ae4787", },

  // { color: "subtle black", bgColor: "#dcdfe4" },
  { color: "black", bgColor: "#8590a2", isBase: true },
  // { color: "bold black", bgColor: "#626f86", },
];

export const utilService = {
  makeId,
  makeLorem,
  getRandomIntInclusive,
  debounce,
  randomPastTime,
  saveToStorage,
  loadFromStorage,
  getColorHashByName,
  capitalizeInitials,
  stringToColor,
  getRandomColor,
  createNewTask,
  createNewGroup,
  boardLabelsArray,
  getBaseColors,
  createNewBoard,
};

export const USERS_KEY = "users";
export const BOARDS_KEY = "boards";
export const LISTS_KEY = "lists";
export const CARDS_KEY = "cards";
export const MEMBERS_KEY = "members";

_createStartInfo();

function makeId(length = 6) {
  var txt = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return txt;
}

function makeLorem(size = 100) {
  var words = [
    "The sky",
    "above",
    "the port",
    "was",
    "the color of television",
    "tuned",
    "to",
    "a dead channel",
    ".",
    "All",
    "this happened",
    "more or less",
    ".",
    "I",
    "had",
    "the story",
    "bit by bit",
    "from various people",
    "and",
    "as generally",
    "happens",
    "in such cases",
    "each time",
    "it",
    "was",
    "a different story",
    ".",
    "It",
    "was",
    "a pleasure",
    "to",
    "burn",
  ];
  var txt = "";
  while (size > 0) {
    size--;
    txt += words[Math.floor(Math.random() * words.length)] + " ";
  }
  return txt;
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

function randomPastTime() {
  const HOUR = 1000 * 60 * 60;
  const DAY = 1000 * 60 * 60 * 24;
  const WEEK = 1000 * 60 * 60 * 24 * 7;

  const pastTime = getRandomIntInclusive(HOUR, WEEK);
  return Date.now() - pastTime;
}

function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function loadFromStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : undefined;
}

function getColorHashByName(colorName) {
  const color = boardLabelsArray.find((color) => color.color === colorName);
  return color;
}

function _createStartInfo() {
  if (import.meta.env.VITE_TRELLO_DARKMODE) {
    localStorage.setItem("dark", import.meta.env.VITE_TRELLO_DARKMODE);
  }

  if (localStorage.getItem("dark") === "true") {
    document.querySelector("html").classList.add("dark");
  }

  //daily refresh
  if (+localStorage.getItem("date") !== new Date().getDate()) {
    localStorage.clear();
    localStorage.setItem("date", new Date().getDate());
  }

  //new states to start with
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(usersJson));
  }
  if (!localStorage.getItem(BOARDS_KEY)) {
    localStorage.setItem(BOARDS_KEY, JSON.stringify(boardsJson));
  }
}

function getRandomColor(name) {
  let hash = 0;
  let i;
  for (i = 0; i < name.length; i += 1) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

function capitalizeInitials(string) {
  return string
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
}

export function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).substr(-2);
  }
  return color;
}
function createNewTask(task) {
  return {
    id: utilService.makeId(),
    members: [],
    badges: {
      attachmentsByType: {
        trello: {
          board: 0,
          card: 0,
        },
      },
      externalSource: null,
      location: false,
      votes: 0,
      viewingMemberVoted: false,
      subscribed: false,
      attachments: 0,
      fogbugz: "",
      checkItems: 0,
      checkItemsChecked: 0,
      checkItemsEarliestDue: null,
      comments: 0,
      description: false,
      due: null,
      dueComplete: false,
      lastUpdatedByAi: false,
      start: null,
    },
    checkItemStates: [],
    closed: false,
    dueComplete: false,
    dateLastActivity: new Date().toISOString(),
    desc: "",
    descData: {
      emoji: {},
    },
    due: null,
    dueReminder: null,
    email: null,
    idBoard: task.idBoard,
    idChecklists: [],
    idGroup: task.groupId,
    idMembers: [],
    idMembersVoted: [],
    idShort: "", // generateShortId(), // Function to generate a short ID
    idAttachmentCover: null,
    labels: [],
    idLabels: [],
    manualCoverAttachment: true,
    name: task.name,
    pos: task.pos, // Default position, can be adjusted
    shortLink: "", // generateShortLink(), // Function to generate a short link
    shortUrl: "", // `https://trello.com/c/${generateShortLink()}`,
    start: null,
    subscribed: false,
    url: "", // `https://trello.com/c/${generateShortLink()}`,
    cover: {
      idAttachment: null,
      color: null,
      idUploadedBackground: null,
      size: "",
      brightness: "",
      scaled: [],
      edgeColor: "",
      sharedSourceUrl: null,
      idPlugin: null,
    },
    isTemplate: false,
    cardRole: null,
  };
}

function createNewGroup(group) {
  return {
    id: utilService.makeId(),
    idBoard: group.idBoard,
    name: group.name,
    closed: false,
    color: null,
    subscribed: false,
    softLimit: null,
    pos: group.pos,
  };
}

async function createNewBoard(board) {
  const user = await userService.getById(import.meta.env.VITE_TRELLO_USER_ID);
  const member = {
    id: user.id,
    fullName: user.fullName,
    username: user.username,
    permissionStatus: "admin",
  };
  return {
    members: [member],
    name: board.name,
    groups: [],
    desc: "",
    descData: null,
    closed: false,
    pinned: false,
    url: "",
    shortUrl: "",
    prefs: {
      permissionLevel: "org",
      hideVotes: false,
      voting: "disabled",
      comments: "members",
      invitations: "members",
      selfJoin: true,
      cardCovers: true,
      cardCounts: false,
      isTemplate: false,
      cardAging: "regular",
      calendarFeedEnabled: false,
      hiddenPluginBoardButtons: [],
      switcherViews: [
        {
          viewType: "Board",
          enabled: true,
        },
        {
          viewType: "Table",
          enabled: true,
        },
        {
          viewType: "Calendar",
          enabled: false,
        },
        {
          viewType: "Dashboard",
          enabled: false,
        },
        {
          viewType: "Timeline",
          enabled: false,
        },
        {
          viewType: "Map",
          enabled: false,
        },
      ],
      background: "64f70bbe4a396a58d14ac118",
      backgroundColor: null,
      backgroundImage:
        "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/original/3d2fdc8b1e42086aed19a614d5ff4147/photo-1693253024090-1fc1e1821a5c",
      backgroundTile: false,
      backgroundBrightness: "dark",
      sharedSourceUrl:
        "https://images.unsplash.com/photo-1693253024090-1fc1e1821a5c?ixid=M3w3MDY2fDB8MXxjb2xsZWN0aW9ufDF8MzE3MDk5fHx8fHwyfHwxNjkzOTExOTgyfA&ixlib=rb-4.0.3&w=2560&h=2048&q=90",
      backgroundImageScaled: [
        {
          width: 140,
          height: 79,
          url: "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/140x79/02964ffe8f5444add9dbe55e14e6e6be/photo-1693253024090-1fc1e1821a5c.jpg",
        },
        {
          width: 256,
          height: 144,
          url: "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/256x144/02964ffe8f5444add9dbe55e14e6e6be/photo-1693253024090-1fc1e1821a5c.jpg",
        },
        {
          width: 480,
          height: 270,
          url: "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/480x270/02964ffe8f5444add9dbe55e14e6e6be/photo-1693253024090-1fc1e1821a5c.jpg",
        },
        {
          width: 960,
          height: 540,
          url: "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/960x540/02964ffe8f5444add9dbe55e14e6e6be/photo-1693253024090-1fc1e1821a5c.jpg",
        },
        {
          width: 1024,
          height: 576,
          url: "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/1024x576/02964ffe8f5444add9dbe55e14e6e6be/photo-1693253024090-1fc1e1821a5c.jpg",
        },
        {
          width: 1280,
          height: 720,
          url: "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/1280x720/02964ffe8f5444add9dbe55e14e6e6be/photo-1693253024090-1fc1e1821a5c.jpg",
        },
        {
          width: 1920,
          height: 1080,
          url: "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/1920x1080/02964ffe8f5444add9dbe55e14e6e6be/photo-1693253024090-1fc1e1821a5c.jpg",
        },
        {
          width: 2048,
          height: 1152,
          url: "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/2048x1152/02964ffe8f5444add9dbe55e14e6e6be/photo-1693253024090-1fc1e1821a5c.jpg",
        },
        {
          width: 2560,
          height: 1440,
          url: "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/original/3d2fdc8b1e42086aed19a614d5ff4147/photo-1693253024090-1fc1e1821a5c",
        },
      ],
      backgroundBottomColor: "#11151f",
      backgroundTopColor: "#dac1b9",
      canBePublic: true,
      canBePrivate: true,
      canInvite: true,
    },
    labelNames: [
      {
        color: "green",
        label: "",
      },
      {
        color: "yellow",
        label: "",
      },
      {
        color: "orange",
        label: "",
      },
      {
        color: "red",
        label: "",
      },
      {
        color: "purple",
        label: "",
      },
      {
        color: "blue",
        label: "",
      },
      {
        color: "sky",
        label: "",
      },
      {
        color: "lime",
        label: "",
      },
      {
        color: "pink",
        label: "",
      },
      {
        color: "black",
        label: "",
      },
    ],
    noInUseLabels: {
      green_dark: "",
      yellow_dark: "",
      orange_dark: "",
      red_dark: "",
      purple_dark: "",
      blue_dark: "",
      sky_dark: "",
      lime_dark: "",
      pink_dark: "",
      black_dark: "",
      green_light: "",
      yellow_light: "",
      orange_light: "",
      red_light: "",
      purple_light: "",
      blue_light: "",
      sky_light: "",
      lime_light: "",
      pink_light: "",
      black_light: "",
    },
    "coverImgs": [
      {
        "bg": "#f2a912",
        "fontColor": "#fff",
        "id": "kmeEGE",
        "photographer": "Tomas Malik",
        "scaledImgs": [
          {
            "id": "6684dcb2ec30a8857a4446d6",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/140x93/6d7f2d57ebfce6e57a63f9cacc470bb6/photo-1719329411191-be2cda36a37c.webp",
            "bytes": 3766,
            "height": 93,
            "width": 140
          },
          {
            "id": "6684dcb2ec30a8857a4466d7",
            "_id": "6684dcb2ec30a8857a4466d7",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/256x171/6d7f2d57ebfce6e57a63f9cacc470bb6/photo-1719329411191-be2cda36a37c.webp",
            "bytes": 8914,
            "height": 171,
            "width": 256
          },
          {
            "id": "6684dcb2ec30a8857a4466d8",
            "_id": "6684dcb2ec30a8857a4466d8",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/480x320/6d7f2d57ebfce6e57a63f9cacc470bb6/photo-1719329411191-be2cda36a37c.webp",
            "bytes": 20338,
            "height": 320,
            "width": 480
          },
          {
            "id": "6684dcb2ec30a8857a4466d9",
            "_id": "6684dcb2ec30a8857a4466d9",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/960x640/6d7f2d57ebfce6e57a63f9cacc470bb6/photo-1719329411191-be2cda36a37c.webp",
            "bytes": 49862,
            "height": 640,
            "width": 960
          },
          {
            "id": "6684dcb2ec30a8857a4466da",
            "_id": "6684dcb2ec30a8857a4466da",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/1024x683/6d7f2d57ebfce6e57a63f9cacc470bb6/photo-1719329411191-be2cda36a37c.webp",
            "bytes": 53888,
            "height": 683,
            "width": 1024
          },
          {
            "id": "6684dcb2ec30a8857a4466dc",
            "_id": "6684dcb2ec30a8857a4466dc",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/1280x854/6d7f2d57ebfce6e57a63f9cacc470bb6/photo-1719329411191-be2cda36a37c.webp",
            "bytes": 71554,
            "height": 854,
            "width": 1280
          },
          {
            "id": "6684dcb2ec30a8857a4466dd",
            "_id": "6684dcb2ec30a8857a4466dd",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/1920x1280/6d7f2d57ebfce6e57a63f9cacc470bb6/photo-1719329411191-be2cda36a37c.webp",
            "bytes": 119468,
            "height": 1280,
            "width": 1920
          },
          {
            "id": "6684dcb2ec30a8857a4466db",
            "_id": "6684dcb2ec30a8857a4466db",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/2048x1366/6d7f2d57ebfce6e57a63f9cacc470bb6/photo-1719329411191-be2cda36a37c.webp",
            "bytes": 131532,
            "height": 1366,
            "width": 2048
          },
          {
            "id": "6684dcb2ec30a8857a4466de",
            "_id": "6684dcb2ec30a8857a4466de",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/2400x1600/6d7f2d57ebfce6e57a63f9cacc470bb6/photo-1719329411191-be2cda36a37c.webp",
            "bytes": 161660,
            "height": 1600,
            "width": 2400
          },
          {
            "id": "6684dcb2ec30a8857a4466df",
            "_id": "6684dcb2ec30a8857a4466df",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/2560x1707/6d7f2d57ebfce6e57a63f9cacc470bb6/photo-1719329411191-be2cda36a37c.webp",
            "bytes": 173290,
            "height": 1707,
            "width": 2560
          }
        ]
      },
      {
        "bg": "#a4d4e4",
        "fontColor": "#000",
        "id": "LrFmk",
        "photographer": "Furkan Elveren",
        "scaledImgs": [
          {
            "id": "6684dcc62182ea43e6103e60",
            "_id": "6684dcc62182ea43e6103e60",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/140x93/0f86a0bbb044d2bfc21f224456f2044a/photo-1719328555718-90eb4fac3e31.webp",
            "bytes": 2470,
            "height": 93,
            "width": 140
          },
          {
            "id": "6684dcc62182ea43e6103e61",
            "_id": "6684dcc62182ea43e6103e61",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/256x171/0f86a0bbb044d2bfc21f224456f2044a/photo-1719328555718-90eb4fac3e31.webp",
            "bytes": 6980,
            "height": 171,
            "width": 256
          },
          {
            "id": "6684dcc62182ea43e6103e62",
            "_id": "6684dcc62182ea43e6103e62",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/480x320/0f86a0bbb044d2bfc21f224456f2044a/photo-1719328555718-90eb4fac3e31.webp",
            "bytes": 21922,
            "height": 320,
            "width": 480
          },
          {
            "id": "6684dcc62182ea43e6103e63",
            "_id": "6684dcc62182ea43e6103e63",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/960x641/0f86a0bbb044d2bfc21f224456f2044a/photo-1719328555718-90eb4fac3e31.webp",
            "bytes": 79890,
            "height": 641,
            "width": 960
          },
          {
            "id": "6684dcc62182ea43e6103e64",
            "_id": "6684dcc62182ea43e6103e64",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/1024x684/0f86a0bbb044d2bfc21f224456f2044a/photo-1719328555718-90eb4fac3e31.webp",
            "bytes": 90084,
            "height": 684,
            "width": 1024
          },
          {
            "id": "6684dcc62182ea43e6103e66",
            "_id": "6684dcc62182ea43e6103e66",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/1280x855/0f86a0bbb044d2bfc21f224456f2044a/photo-1719328555718-90eb4fac3e31.webp",
            "bytes": 136164,
            "height": 855,
            "width": 1280
          },
          {
            "id": "6684dcc62182ea43e6103e67",
            "_id": "6684dcc62182ea43e6103e67",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/1920x1282/0f86a0bbb044d2bfc21f224456f2044a/photo-1719328555718-90eb4fac3e31.webp",
            "bytes": 276964,
            "height": 1282,
            "width": 1920
          },
          {
            "id": "6684dcc62182ea43e6103e65",
            "_id": "6684dcc62182ea43e6103e65",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/2048x1367/0f86a0bbb044d2bfc21f224456f2044a/photo-1719328555718-90eb4fac3e31.webp",
            "bytes": 306050,
            "height": 1367,
            "width": 2048
          },
          {
            "id": "6684dcc62182ea43e6103e68",
            "_id": "6684dcc62182ea43e6103e68",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/2397x1600/0f86a0bbb044d2bfc21f224456f2044a/photo-1719328555718-90eb4fac3e31.webp",
            "bytes": 395844,
            "height": 1600,
            "width": 2397
          },
          {
            "id": "6684dcc62182ea43e6103e69",
            "_id": "6684dcc62182ea43e6103e69",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/2560x1709/0f86a0bbb044d2bfc21f224456f2044a/photo-1719328555718-90eb4fac3e31.webp",
            "bytes": 443686,
            "height": 1709,
            "width": 2560
          }
        ]
      },
      {
        "bg": "#7e8d90",
        "fontColor": "#000",
        "id": "PsFBt",
        "photographer": "Plwel Czerwinski",
        "scaledImgs": [
          {
            "id": "6684dd435af9199cb6283700",
            "_id": "6684dd435af9199cb6283700",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/67x100/753af4c32d1d87db146413e85ab15ece/photo-1719844841024-3c7166816fc7.webp",
            "bytes": 1104,
            "height": 100,
            "width": 67
          },
          {
            "id": "6684dd435af9199cb6283701",
            "_id": "6684dd435af9199cb6283701",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/128x192/753af4c32d1d87db146413e85ab15ece/photo-1719844841024-3c7166816fc7.webp",
            "bytes": 2946,
            "height": 192,
            "width": 128
          },
          {
            "id": "6684dd435af9199cb6283702",
            "_id": "6684dd435af9199cb6283702",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/320x480/753af4c32d1d87db146413e85ab15ece/photo-1719844841024-3c7166816fc7.webp",
            "bytes": 13346,
            "height": 480,
            "width": 320
          },
          {
            "id": "6684dd435af9199cb6283703",
            "_id": "6684dd435af9199cb6283703",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/640x960/753af4c32d1d87db146413e85ab15ece/photo-1719844841024-3c7166816fc7.webp",
            "bytes": 46460,
            "height": 960,
            "width": 640
          },
          {
            "id": "6684dd435af9199cb6283704",
            "_id": "6684dd435af9199cb6283704",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/683x1024/753af4c32d1d87db146413e85ab15ece/photo-1719844841024-3c7166816fc7.webp",
            "bytes": 52706,
            "height": 1024,
            "width": 683
          },
          {
            "id": "6684dd435af9199cb6283705",
            "_id": "6684dd435af9199cb6283705",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/853x1280/753af4c32d1d87db146413e85ab15ece/photo-1719844841024-3c7166816fc7.webp",
            "bytes": 79564,
            "height": 1280,
            "width": 853
          },
          {
            "id": "6684dd435af9199cb6283707",
            "_id": "6684dd435af9199cb6283707",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/1066x1600/753af4c32d1d87db146413e85ab15ece/photo-1719844841024-3c7166816fc7.webp",
            "bytes": 120586,
            "height": 1600,
            "width": 1066
          },
          {
            "id": "6684dd435af9199cb6283706",
            "_id": "6684dd435af9199cb6283706",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/1280x1920/753af4c32d1d87db146413e85ab15ece/photo-1719844841024-3c7166816fc7.webp",
            "bytes": 167332,
            "height": 1920,
            "width": 1280
          },
          {
            "id": "6684dd435af9199cb6283708",
            "_id": "6684dd435af9199cb6283708",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/1365x2048/753af4c32d1d87db146413e85ab15ece/photo-1719844841024-3c7166816fc7.webp",
            "bytes": 190862,
            "height": 2048,
            "width": 1365
          }
        ]
      },
      {
        "bg": "#d9d3c3",
        "fontColor": "#000",
        "id": "ZSfv7J",
        "photographer": "Eberhard Grossgasteiger",
        "scaledImgs": [
          {
            "id": "6684dcba9bd9eadcbe170caa",
            "_id": "6684dcba9bd9eadcbe170caa",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/140x93/45fe2b2cb99b9307e941023890f4fe2f/photo-1719217469234-bb53c12ed515.webp",
            "bytes": 1472,
            "height": 93,
            "width": 140
          },
          {
            "id": "6684dcba9bd9eadcbe170cab",
            "_id": "6684dcba9bd9eadcbe170cab",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/256x171/45fe2b2cb99b9307e941023890f4fe2f/photo-1719217469234-bb53c12ed515.webp",
            "bytes": 3522,
            "height": 171,
            "width": 256
          },
          {
            "id": "6684dcba9bd9eadcbe170cac",
            "_id": "6684dcba9bd9eadcbe170cac",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/480x320/45fe2b2cb99b9307e941023890f4fe2f/photo-1719217469234-bb53c12ed515.webp",
            "bytes": 9048,
            "height": 320,
            "width": 480
          },
          {
            "id": "6684dcba9bd9eadcbe170cad",
            "_id": "6684dcba9bd9eadcbe170cad",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/960x640/45fe2b2cb99b9307e941023890f4fe2f/photo-1719217469234-bb53c12ed515.webp",
            "bytes": 25222,
            "height": 640,
            "width": 960
          },
          {
            "id": "6684dcba9bd9eadcbe170cae",
            "_id": "6684dcba9bd9eadcbe170cae",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/1024x683/45fe2b2cb99b9307e941023890f4fe2f/photo-1719217469234-bb53c12ed515.webp",
            "bytes": 27456,
            "height": 683,
            "width": 1024
          },
          {
            "id": "6684dcba9bd9eadcbe170cb0",
            "_id": "6684dcba9bd9eadcbe170cb0",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/1280x854/45fe2b2cb99b9307e941023890f4fe2f/photo-1719217469234-bb53c12ed515.webp",
            "bytes": 37364,
            "height": 854,
            "width": 1280
          },
          {
            "id": "6684dcba9bd9eadcbe170cb1",
            "_id": "6684dcba9bd9eadcbe170cb1",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/1920x1280/45fe2b2cb99b9307e941023890f4fe2f/photo-1719217469234-bb53c12ed515.webp",
            "bytes": 63310,
            "height": 1280,
            "width": 1920
          },
          {
            "id": "6684dcba9bd9eadcbe170caf",
            "_id": "6684dcba9bd9eadcbe170caf",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/2048x1366/45fe2b2cb99b9307e941023890f4fe2f/photo-1719217469234-bb53c12ed515.webp",
            "bytes": 69180,
            "height": 1366,
            "width": 2048
          },
          {
            "id": "6684dcba9bd9eadcbe170cb2",
            "_id": "6684dcba9bd9eadcbe170cb2",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/2400x1600/45fe2b2cb99b9307e941023890f4fe2f/photo-1719217469234-bb53c12ed515.webp",
            "bytes": 84878,
            "height": 1600,
            "width": 2400
          },
          {
            "id": "6684dcba9bd9eadcbe170cb3",
            "_id": "6684dcba9bd9eadcbe170cb3",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/2560x1707/45fe2b2cb99b9307e941023890f4fe2f/photo-1719217469234-bb53c12ed515.webp",
            "bytes": 93378,
            "height": 1707,
            "width": 2560
          }
        ]
      },
      {
        "bg": "#e2e6e6",
        "fontColor": "#fff",
        "id": "Ui4Dng",
        "photographer": "George Bale",
        "scaledImgs": [
          {
            "id": "6684dd0c0378ec4fd5affe96",
            "_id": "6684dd0c0378ec4fd5affe96",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/140x79/c1e752f0947b58d7bf9cd82cd2855e0f/photo-1719357101152-32d926e518d4.webp",
            "bytes": 1994,
            "height": 79,
            "width": 140
          },
          {
            "id": "6684dd0c0378ec4fd5affe97",
            "_id": "6684dd0c0378ec4fd5affe97",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/256x144/c1e752f0947b58d7bf9cd82cd2855e0f/photo-1719357101152-32d926e518d4.webp",
            "bytes": 5474,
            "height": 144,
            "width": 256
          },
          {
            "id": "6684dd0c0378ec4fd5affe98",
            "_id": "6684dd0c0378ec4fd5affe98",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/480x270/c1e752f0947b58d7bf9cd82cd2855e0f/photo-1719357101152-32d926e518d4.webp",
            "bytes": 17200,
            "height": 270,
            "width": 480
          },
          {
            "id": "6684dd0c0378ec4fd5affe99",
            "_id": "6684dd0c0378ec4fd5affe99",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/960x540/c1e752f0947b58d7bf9cd82cd2855e0f/photo-1719357101152-32d926e518d4.webp",
            "bytes": 61686,
            "height": 540,
            "width": 960
          },
          {
            "id": "6684dd0c0378ec4fd5affe9a",
            "_id": "6684dd0c0378ec4fd5affe9a",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/1024x576/c1e752f0947b58d7bf9cd82cd2855e0f/photo-1719357101152-32d926e518d4.webp",
            "bytes": 68828,
            "height": 576,
            "width": 1024
          },
          {
            "id": "6684dd0c0378ec4fd5affe9c",
            "_id": "6684dd0c0378ec4fd5affe9c",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/1280x720/c1e752f0947b58d7bf9cd82cd2855e0f/photo-1719357101152-32d926e518d4.webp",
            "bytes": 102616,
            "height": 720,
            "width": 1280
          },
          {
            "id": "6684dd0c0378ec4fd5affe9d",
            "_id": "6684dd0c0378ec4fd5affe9d",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/1920x1079/c1e752f0947b58d7bf9cd82cd2855e0f/photo-1719357101152-32d926e518d4.webp",
            "bytes": 207494,
            "height": 1079,
            "width": 1920
          },
          {
            "id": "6684dd0c0378ec4fd5affe9b",
            "_id": "6684dd0c0378ec4fd5affe9b",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/2048x1151/c1e752f0947b58d7bf9cd82cd2855e0f/photo-1719357101152-32d926e518d4.webp",
            "bytes": 227212,
            "height": 1151,
            "width": 2048
          },
          {
            "id": "6684dd0c0378ec4fd5affe9e",
            "_id": "6684dd0c0378ec4fd5affe9e",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/2560x1439/c1e752f0947b58d7bf9cd82cd2855e0f/photo-1719357101152-32d926e518d4.webp",
            "bytes": 324912,
            "height": 1439,
            "width": 2560
          }
        ]
      },
      {
        "bg": "#f2f2fb",
        "fontColor": "#000",
        "id": "W3Vgbg",
        "photographer": "Eberhard Grossgasteiger",
        "scaledImgs": [
          {
            "id": "6684dd1343b8a9a9a6298b97",
            "_id": "6684dd1343b8a9a9a6298b97",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/67x100/f09c338fecffe282c5311ee0c4dccd76/photo-1719216324560-523fc4ddb8b9.webp",
            "bytes": 1230,
            "height": 100,
            "width": 67
          },
          {
            "id": "6684dd1343b8a9a9a6298b98",
            "_id": "6684dd1343b8a9a9a6298b98",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/128x192/f09c338fecffe282c5311ee0c4dccd76/photo-1719216324560-523fc4ddb8b9.webp",
            "bytes": 3350,
            "height": 192,
            "width": 128
          },
          {
            "id": "6684dd1343b8a9a9a6298b99",
            "_id": "6684dd1343b8a9a9a6298b99",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/320x480/f09c338fecffe282c5311ee0c4dccd76/photo-1719216324560-523fc4ddb8b9.webp",
            "bytes": 17352,
            "height": 480,
            "width": 320
          },
          {
            "id": "6684dd1343b8a9a9a6298b9a",
            "_id": "6684dd1343b8a9a9a6298b9a",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/640x960/f09c338fecffe282c5311ee0c4dccd76/photo-1719216324560-523fc4ddb8b9.webp",
            "bytes": 61826,
            "height": 960,
            "width": 640
          },
          {
            "id": "6684dd1343b8a9a9a6298b9b",
            "_id": "6684dd1343b8a9a9a6298b9b",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/683x1024/f09c338fecffe282c5311ee0c4dccd76/photo-1719216324560-523fc4ddb8b9.webp",
            "bytes": 69524,
            "height": 1024,
            "width": 683
          },
          {
            "id": "6684dd1343b8a9a9a6298b9c",
            "_id": "6684dd1343b8a9a9a6298b9c",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/853x1280/f09c338fecffe282c5311ee0c4dccd76/photo-1719216324560-523fc4ddb8b9.webp",
            "bytes": 102294,
            "height": 1280,
            "width": 853
          },
          {
            "id": "6684dd1343b8a9a9a6298b9e",
            "_id": "6684dd1343b8a9a9a6298b9e",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/1066x1600/f09c338fecffe282c5311ee0c4dccd76/photo-1719216324560-523fc4ddb8b9.webp",
            "bytes": 146730,
            "height": 1600,
            "width": 1066
          },
          {
            "id": "6684dd1343b8a9a9a6298b9d",
            "_id": "6684dd1343b8a9a9a6298b9d",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/1280x1920/f09c338fecffe282c5311ee0c4dccd76/photo-1719216324560-523fc4ddb8b9.webp",
            "bytes": 195844,
            "height": 1920,
            "width": 1280
          },
          {
            "id": "6684dd1343b8a9a9a6298b9f",
            "_id": "6684dd1343b8a9a9a6298b9f",
            "scaled": true,
            "url": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/1365x2048/f09c338fecffe282c5311ee0c4dccd76/photo-1719216324560-523fc4ddb8b9.webp",
            "bytes": 216812,
            "height": 2048,
            "width": 1365
          }
        ]
      }
    ]
  };
}

function getBaseColors() {
  return boardLabelsArray.filter((color) => color.isBase);
}
