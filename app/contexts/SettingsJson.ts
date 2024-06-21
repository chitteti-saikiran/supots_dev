const _Profile = {
  // Security: [
  //     {
  //         name:"Login Alerts",
  //         config: [
  //             {
  //                 textOnly: false,
  //                 selfExpand: false,
  //                 desc: "Get an alert when anyone logs into your account from an unrecognized device or browser.",
  //                 settings: [
  //                     {
  //                         desc: "Notifications",
  //                         action: "switch", //dropdown, switch
  //                         options: [],
  //                         subDesc: false,
  //                         default: true,
  //                         tag: "login_notice"
  //                     },
  //                     {
  //                         desc: "Emails",
  //                         action: "switch", //dropdown, switch
  //                         options: [],
  //                         subDesc: false,
  //                         default: true,
  //                         tag: "login_email"
  //                     }
  //                 ]
  //             },
  //         ]
  //     },
  //     {
  //         name:"Manage Logins",
  //         config: [
  //             {
  //                 textOnly: true,
  //                 selfExpand: true,
  //                 desc: "Change Passsword",
  //                 settings: [
  //                     {
  //                         desc: "",
  //                         action: "change-password", //dropdown, switch
  //                         options: [],
  //                         subDesc: false,
  //                         default: true,
  //                         tag: "login_change_"
  //                     }
  //                 ]
  //             },
  //             {
  //                 textOnly: true,
  //                 selfExpand: true,
  //                 desc: "Choose 2-3 friends to contact if your get locked out",
  //                 settings: [
  //                     {
  //                         desc: "Type @ to tag your friend, then use ',' to seperate them",
  //                         action: "field", //dropdown, switch
  //                         options: [],
  //                         subDesc: false,
  //                         default: "",
  //                         tag: "login_auth_"
  //                     }
  //                 ]
  //             },
  //         ]
  //     },
  //     {
  //         name:"Deactivate Account",
  //         config: [
  //             {
  //                 textOnly: false,
  //                 selfExpand: false,
  //                 desc: "Choose whether you want to keep your account active or deactivate it.",
  //                 settings: [
  //                     {
  //                         desc: "Deactivate account?",
  //                         action: "button", //dropdown, switch
  //                         btnTxt: "Deactivate account",
  //                         options: [],
  //                         subDesc: false,
  //                         default: "deactivate",
  //                         tag: ""
  //                     }
  //                 ]
  //             },
  //         ]
  //     },
  // ],
  // "General":[],
  "Privacy":[
      {
          name: "Who can see my stuff?",
          config: [
              {
                  textOnly: false,
                  selfExpand: false,
                  desc: "Who can see your future posts?",
                  settings: [
                      {
                          desc: "You can manage the privacy of things you share by using the audience selector right where you post. This control remembers your selection so future posts will be shared with the same audience unless you change it",
                          action: "select", //dropdown, switch
                          options: ["Friends","Private","Public"],
                          subDesc: false,
                          default: "Friends",
                          tag: "who_to_see_posts"
                      }
                  ]
              },
              {
                  textOnly: false,
                  selfExpand: false,
                  desc: "Review all your posts and things you're tagged in.",
                  settings: [
                      {
                          desc: "Review posts?",
                          action: "switch", //dropdown, switch
                          options: [],
                          subDesc: false,
                          default: true,
                          tag: "review_post"
                      },
                      {
                          desc: "Go back in time, see logs from your recent actions on the platform",
                          action: "switch",
                          btnTxt: "" ,//dropdown, switch
                          options: [],
                          subDesc: false,
                          default: true,
                          tag: "activity_log"
                      }
                  ]
              },
          ]
      },
      {
          name: "Who can contact me?",
          config: [
              {
                  textOnly: false,
                  selfExpand: false,
                  desc: "Who can send you friend requests?",
                  settings: [
                      {
                          desc: "Limit who can send you friend requests",
                          action: "select", //dropdown, switch
                          options: ["Private","Public"],
                          subDesc: false,
                          default: "Private",
                          tag: "can_send_friend_request"
                      }
                  ]
              },
              {
                  textOnly: false,
                  selfExpand: false,
                  desc: "Who can see your friends list?",
                  settings: [
                      {
                          desc: "Remember, your friends control who can see their friendships on their own Timelines. If people can see your friendship on another timeline, they'll be able to see it in your posts.",
                          action: "select", //dropdown, switch
                          options: ["Friends","Private","Public"],
                          subDesc: false,
                          default: "Friends",
                          tag: "can_see_friends"
                      }
                  ]
              },
          ]
      },
      /*{
          name:"Profile Updates",
          config: [
              {
                  textOnly: false,
                  selfExpand: false,
                  desc: "Posts are automatically created and published when you update profile info, receive reviews and more.",
                  settings: [
                      {
                          desc: "Turn off/on",
                          action: "switch", //dropdown, switch
                          options: [],
                          subDesc: false,
                          default: true,
                          tag: "log_update"
                      }
                  ]
              },
          ]
      },*/
      {
          name: "Who can look me up?",
          config: [
              {
                  textOnly: false,
                  selfExpand: false,
                  desc: "Who can look you up using the profile details you provided?",
                  settings: [
                      {
                          desc: "Who can look me up?",
                          action: "select", //dropdown, switch
                          options: ["Friends","Private","Public"],
                          subDesc: false,
                          default: "Friends",
                          tag: "can_search"
                      }
                  ]
              },
              {
                  textOnly: false,
                  selfExpand: false,
                  desc: "Who can look you up using the email address you provided?",
                  settings: [
                      {
                          desc: "This applies to people who can't see your email address on your profile.",
                          action: "select", //dropdown, switch
                          options: ["Friends","Private","Public"],
                          subDesc: false,
                          default: "Friends",
                          tag: "can_search_email"
                      }
                  ]
              },
              {
                  textOnly: false,
                  selfExpand: false,
                  desc: "Who can look you up using the phone number you provided?",
                  settings: [
                      {
                          desc: "This applies to people who can't see your phone number on your profile.",
                          action: "select", //dropdown, switch
                          options: ["Friends","Private","Public"],
                          subDesc: false,
                          default: "Friends",
                          tag: "can_search_number"
                      }
                  ]
              }
          ]
      }
  ],
  "Timeline & Tagging":[
      {
          name: "Who can add things to my timeline?",
          config: [
              {
                  textOnly: false,
                  selfExpand: false,
                  desc:"Anyone can publish to the Page, Media, on block them from posting on timeline",
                  settings: [
                      {
                          desc: "Allow visitors to the Page to publish Posts",
                          action: "switch", //dropdown, switch
                          options: [],
                          subDesc: "",
                          default: true,
                          tag: "can_post"
                      },
                      {
                          desc: "Allow photo and video posts",
                          action: "switch", //dropdown, switch
                          options: [],
                          subDesc: "",
                          default: true,
                          tag: "can_post_media"
                      }
                  ]
              },
              {
                  textOnly: false,
                  selfExpand: false,
                  desc:"Allow people to comment on your posts?",
                  settings: [
                      {
                          desc: "Allow comment or reply on your posts?",
                          action: "switch", //dropdown, switch
                          options: [],
                          subDesc: "",
                          default: true,
                          tag: "can_comment"
                      },
                      {
                          desc: "Allow link comments on posts?",
                          action: "switch", //dropdown, switch
                          options: [],
                          subDesc: "",
                          default: true,
                          tag: "can_comment_link"
                      }
                  ]
              },
              {
                  textOnly: false,
                  selfExpand: false,
                  desc: "Who can tag you on posts?",
                  settings: [
                      {
                          desc: "Who can tag me on posts?",
                          action: "select", //dropdown, switch
                          options: ["Friends","Private","Public"],
                          subDesc: "",
                          default: "Friends",
                          tag: "can_tag"
                      }
                  ]
              },
              {
                  textOnly: false,
                  selfExpand: false,
                  desc: "Review posts friends tag you in before they appear on your timeline?",
                  settings: [
                      {
                          desc: "Timeline Review controls whether you have to manually approve posts you're tagged in before they go on your timeline. When you have a post to review, just click Timeline Review on the left hand side of your Activity Log.<br/><br/><strong>Note</strong>: This only controls what's allowed on your timeline. Posts you\'re tagged in still appear in search, news feed and other places.",
                          action: "switch", //dropdown, switch
                          options: [],
                          subDesc: "",
                          default: false,
                          tag: "review_posts"
                      }
                  ]
              }
          ]
      },
      // {
      //     name: "Who can see things on my timeline?",
      //     config: [
      //         {
      //             textOnly: false,
      //             selfExpand: false,
      //             desc: "Review what other people see on your timeline.",
      //             settings: [
      //                 {
      //                     desc: "",
      //                     action: "button",
      //                     btnTxt: "View As", //dropdown, switch
      //                     options: [],
      //                     subDesc: "",
      //                     default: false,
      //                     tag: ""
      //                 }
      //             ]
      //         },
      //         {
      //             textOnly: false,
      //             selfExpand: false,
      //             desc: "Who can see posts you've been tagged in on your timeline?",
      //             settings: [
      //                 {
      //                     desc: "",
      //                     action: "select", //dropdown, switch
      //                     options: ["Friends","Private","Public"],
      //                     subDesc: "",
      //                     default: "Friends",
      //                     tag: "can_see_tagged_posts"
      //                 }
      //             ]
      //         },
      //         {
      //             textOnly: false,
      //             selfExpand: false,
      //             desc: "Who can see what others post on your timeline?",
      //             settings: [
      //                 {
      //                     desc: "",
      //                     action: "select", //dropdown, switch
      //                     options: ["Friends","Private","Public"],
      //                     subDesc: "",
      //                     default: "Friends",
      //                     tag: "can_see_posts"
      //                 }
      //             ]
      //         }
      //     ]
      // },
      /*{
          name: "How can I manage tags people add and tagging suggestions?",
          config: [

          ]
      }*/
  ],
  // "Blocking":[
  //     {
  //         name: "Restricted List",
  //         config: [
  //             {
  //                 textOnly: false,
  //                 selfExpand: false,
  //                 desc: "When you add a friend to your Restricted List, they won't see posts that you share only to Friends. They may still see things you share to Public or on a mutual friend's Timeline, and posts they're tagged in.",
  //                 settings: [
  //                     {
  //                         desc: "Type @ to tag your friend, then use ',' to seperate them",
  //                         action: "field", //dropdown, switch
  //                         options: [],
  //                         subDesc: "",
  //                         default: "",
  //                         tag: "restricted"
  //                     }
  //                 ]
  //             }
  //         ]
  //     },
  //     {
  //         name: "Block users",
  //         config: [
  //             {
  //                 textOnly: false,
  //                 selfExpand: false,
  //                 desc: "Once you block someone, that person can no longer see things you post on your timeline, tag you, invite you to events or groups, start a conversation with you, or add you as a friend. Note: Does not include apps, games or groups you both participate in.",
  //                 settings: [
  //                     {
  //                         desc: "Type @ to tag your friend, then use ',' to seperate them",
  //                         action: "field", //dropdown, switch
  //                         options: [],
  //                         subDesc: "",
  //                         default: "",
  //                         tag: "blocked"
  //                     }
  //                 ]
  //             }
  //         ]
  //     },
  //     {
  //         name: "Block Messages",
  //         config: [
  //             {
  //                 textOnly: false,
  //                 selfExpand: false,
  //                 desc: "If you block messages and video calls from someone here, they won't be able to contact you. Unless you block someone's profile, they may be able to post on your Timeline, tag you, and comment on your posts or comments.",
  //                 settings: [
  //                     {
  //                         desc: "Type @ to tag your friend, then use ',' to seperate them",
  //                         action: "field", //dropdown, switch
  //                         options: [],
  //                         subDesc: "",
  //                         default: "",
  //                         tag: "blocked_msg"
  //                     }
  //                 ]
  //             }
  //         ]
  //     }
  // ],
  "Notifcations":[
      {
          name: "On Suptosu",
          config: [
              {
                  textOnly: true,
                  desc : "You'll see every notification on Supotsu, but you can turn off notifications about specific games, events and posts as you view them."
              },
              {
                  textOnly: true,
                  selfExpand: true,
                  desc: "Sounds",
                  settings: [
                      {
                          desc: "Play a sound when each new notification is received",
                          action: "switch", //dropdown, switch
                          options: [],
                          subDesc: false,
                          default: false,
                          tag: "sound_notice"
                      },
                      {
                          desc: "Play a sound when a message is received",
                          action: "switch", //dropdown, switch
                          options: [],
                          subDesc: false,
                          default: true,
                          tag: "sound_msg_notice"
                      }
                  ]
              },
              {
                  textOnly: true,
                  selfExpand: true,
                  desc: "What you get notified about",
                  settings: [
                      {
                          desc: "Activity that involves you",
                          action: "switch", //dropdown, switch
                          options: [],
                          subDesc: "You'll always get notifications about activity that involves you, such as when you are invited to play in a game, team or fixtures notifications or someone tags you in a photo or comments on your post",
                          default: false,
                          tag: "timeline_event_post,timeline_group_post"
                      },
                      {
                          desc: "Birthdays",
                          action: "switch", //dropdown, switch
                          options: [],
                          subDesc: "Choose whether you want to get notifications about your friends' birthdays.",
                          default: false,
                          tag: "timeline_post"
                      },
                      {
                          desc: "Close Friends activity",
                          action: "switches", //dropdown, switch
                          options: [
                              {
                                  label: "Email",
                                  default: false,
                                  tag: "friends_email"
                              },
                              {
                                  label: "Supotsu",
                                  default: false,
                                  tag: "friends_app"
                              }
                          ],
                          subDesc: "Choose whether you want to get notifications about Close Friends.",
                          default: false,
                          tag: "friends"
                      },
                      {
                          desc: "Club/Team/League activity",
                          action: "switches", //dropdown, switch
                          options: [
                              {
                                  label: "Email",
                                  default: false,
                                  tag: ""
                              },
                              {
                                  label: "Supotsu",
                                  default: false,
                                  tag: ""
                              }
                          ],
                          subDesc: "Choose whether you want to get notifications about Clubs, Teams and Leagues.",
                          default: false
                      },
                      {
                          desc: "Games",
                          action: "switch", //dropdown, switch
                          options: [],
                          subDesc: "Choose if you want to receive notifications when a game is about to start.",
                          default: false,
                          tag: "game_accept,game_invite"
                      }
                  ]
              }
          ]
      },
      {
          name: "Email Address",
          config: [
              {
                  textOnly: true,
                  desc : "To turn off a specific email notification, just click the unsubscribe link at the bottom of the email."
              },
              {
                  textOnly: true,
                  selfExpand: true,
                  rules: ["All notifications, except the ones you unsubscribe from",
                  "Important notifications about you or activity you've missed",
                  "Only notifications about your account, security and privacy"],
                  desc: "What you'll receive",
                  settings: [
                      {
                          desc: "Messages",
                          action: "switch", //dropdown, switch
                          options: [],
                          subDesc: false,
                          default: false,
                          tag: "message_group_sent,message_sent"
                      },
                      {
                          desc: "Posts on your timeline",
                          action: "switch", //dropdown, switch
                          options: [],
                          subDesc: false,
                          default: true,
                          tag: "timeline_post"
                      },
                      {
                          desc: "Friend requests",
                          action: "switch", //dropdown, switch
                          options: [],
                          subDesc: false,
                          default: false,
                          tag: "relation_ship_request"
                      },
                      {
                          desc: "Play in a game",
                          action: "switch", //dropdown, switch
                          options: [],
                          subDesc: false,
                          default: true,
                          tag: "game_invite"
                      },
                      {
                          desc: "Posts you're tagged in",
                          action: "switch", //dropdown, switch
                          options: [],
                          subDesc: false,
                          default: false,
                          tag: "post_tag"
                      },
                      {
                          desc: "Club/Team Invitations",
                          action: "switch", //dropdown, switch
                          options: [],
                          subDesc: false,
                          default: true,
                          tag: "club_invite,team_invite"
                      },
                      {
                          desc: "Comments",
                          action: "switch", //dropdown, switch
                          options: [],
                          subDesc: false,
                          default: false,
                          tag: "post_comment,comment_reply"
                      },
                      {
                          desc: "Requests to join teams/Clubs/Fixtures as an admin",
                          action: "switch", //dropdown, switch
                          options: [],
                          subDesc: false,
                          default: true,
                          tag: "club_invite,team_invite"
                      },
                      {
                          desc: "Upcoming birthdays",
                          action: "switch", //dropdown, switch
                          options: [],
                          subDesc: false,
                          default: true,
                          tag: "upcoming_birthday"
                      },
                      {
                          desc: "Friend confirmations",
                          action: "switch", //dropdown, switch
                          options: [],
                          subDesc: false,
                          default: true,
                          tag: "relation_ship_accept"
                      },
                      {
                          desc: "Likes on your posts",
                          action: "switch", //dropdown, switch
                          options: [],
                          subDesc: false,
                          default: true,
                          tag: "comment_like,reply_like,post_like"
                      },
                      {
                          desc: "Becoming a Team Captain",
                          action: "switch", //dropdown, switch
                          options: [],
                          subDesc: false,
                          default: true,
                          tag: "become_captain"
                      },
                      {
                          desc: "Groups",
                          action: "switch", //dropdown, switch
                          options: [],
                          subDesc: false,
                          default: true,
                          tag: "group_forum_add,group_forum_role,group_forum_join,group_add"
                      },
                      {
                          desc: "Events",
                          action: "switch", //dropdown, switch
                          options: [],
                          subDesc: false,
                          default: true,
                          tag: "event_invite,event_admin_invite, event_accept"
                      },{
                          desc: "Training Material and Sessions",
                          action: "switch", //dropdown, switch
                          options: [],
                          subDesc: false,
                          default: true,
                          tag: "session_material_add,session_file_share"
                      }
                  ]
              },
          ]
      }
  ]
};

const _Page = {
  "General":[
      {
          name: "Page Visibility",
          config: [
              {
                  textOnly: false,
                  selfExpand: false,
                  desc: "Manage your page visibility here, choose whether to to publish or unpublish this page",
                  settings: [
                      {
                          desc: "",
                          action: "select", //dropdown, switch
                          options: ["Published","Unpublished"],
                          subDesc: false,
                          default: "Published",
                          tag: "page_visibility"
                      }
                  ]
              }
          ]
      },
      {
          name: "Page Verification",
          config: [
              {
                  textOnly: false,
                  selfExpand: false,
                  desc:"Manage page verification, can also use verification link sent to your email address during page sign up process",
                  settings: [
                      {
                          desc: "Page has not been verified!",
                          descIf: "Page has been verified!" ,
                          action: "switch", //dropdown, switch,
                          readOnly: true,
                          hasAction: true,
                          actionButton: {
                              onClick(type, id){
                                  const url = "/confirm/"+type+"/"+id;
                                  window.open(url)
                              },
                              text: "Verify"
                          },
                          options: [],
                          subDesc: false,
                          default: false,
                          tag: "page_verification"
                      }
                  ]
              }
          ]
      },
      {
          name: "Visitor posts",
          config: [
              {
                  textOnly: false,
                  selfExpand: false,
                  desc:"Anyone can publish to the Page, Media, on block them from posting on timeline",
                  settings: [
                      {
                          desc: "Allow visitors to the Page to publish Posts",
                          action: "switch", //dropdown, switch
                          options: [],
                          subDesc: "",
                          default: true,
                          tag: "can_post"
                      },
                      {
                          desc: "Allow photo and video posts",
                          action: "switch", //dropdown, switch
                          options: [],
                          subDesc: "",
                          default: true,
                          tag: "can_post_media"
                      }
                  ]
              },
              {
                  textOnly: false,
                  selfExpand: false,
                  desc: "Review posts friends tag you in before they appear on your timeline?",
                  settings: [
                      {
                          desc: "Timeline Review controls whether you have to manually approve posts you're tagged in before they go on your timeline. When you have a post to review, just click Timeline Review on the left hand side of your Activity Log.<br/><br/><strong>Note</strong>: This only controls what's allowed on your timeline. Posts you\'re tagged in still appear in search, news feed and other places.",
                          action: "switch", //dropdown, switch
                          options: [],
                          subDesc: "",
                          default: false,
                          tag: "review_posts"
                      }
                  ]
              }
          ]
      },
      /*{
          name: "Age restrictions",
          config: [
              {
                  textOnly: false,
                  selfExpand: false,
                  desc:"Restrict profile from users under a curtain age. the default is 13+ unless changed in the settings.",
                  settings: [
                      {
                          desc: "",
                          descIf: "" ,
                          action: "select",
                          options: ["13","16","20"],
                          subDesc: false,
                          default: "13",
                          tag: "age_restriction"
                      }
                  ]
              }
          ]
      }*/,
      {
          name: "Post Attribution",
          config: [
              {
                  textOnly: false,
                  selfExpand: false,
                  desc:"When you are a designated page admin, your posts, likes and comments on this Page's timeline will be attributed to the Page by default while on the club, team, game, institution, league or group Manager. When you're not on the page in question your posts, likes and comments on this Page's timeline will be attributed to yourself.",
                  settings: [
                      {
                          desc: "Turn on/off",
                          descIf: "" ,
                          action: "switch",
                          options: [],
                          subDesc: false,
                          default: true,
                          tag: "post_attribution"
                      }
                  ]
              }
          ]
      },
      {
          name: "Page moderation/Profanity filter",
          config: [
              {
                  textOnly: false,
                  selfExpand: false,
                  desc:"Set a list of word you wish to block from your page. If a user's post contain a match from this list, that word will not be shown on the post",
                  settings: [
                      {
                          desc: "",
                          descIf: "" ,
                          action: "field",
                          isPlainField: true,
                          options: [],
                          subDesc: false,
                          default: "",
                          tag: "word_restrition"
                      }
                  ]
              }
          ]
      },
      /*{
          name:"Page Updates",
          config: [
              {
                  textOnly: false,
                  selfExpand: false,
                  desc: "Posts are automatically created and published when you update Page info, reach milestones, receive reviews and more.",
                  settings: [
                      {
                          desc: "Turn off/on",
                          action: "switch", //dropdown, switch
                          options: [],
                          subDesc: false,
                          default: true,
                          tag: "log_update"
                      }
                  ]
              },
          ]
      },*/
      {
          name:"Delete Page",
          config: [
              {
                  textOnly: false,
                  selfExpand: false,
                  desc: "Choose whether you want to keep your page active or deactivate it.",
                  settings: [
                      {
                          desc: "Deactivate page?",
                          action: "switch", //dropdown, switch
                          btnTxt: "Delete Page",
                          options: [],
                          subDesc: false,
                          default: false,
                          tag: "profile_visibilty"
                      }
                  ]
              },
          ]
      },
  ],
  "Messaging":[
      {
          name: "General Settings",
          config: [
              {
                  textOnly: false,
                  selfExpand: false,
                  desc: "Use the Return key to send messages<br/>When you have written a message, you can tap the Return/Enter key to send it.",
                  settings: [
                      {
                          desc: "Turn on/off",
                          action: "switch", //dropdown, switch
                          options: [],
                          subDesc: false,
                          default: false,
                          tag: "return_submit_msg"
                      }
                  ]
              }
          ]
      },
      {
          name: "Response Assistant",
          config: [
              {
                  textOnly: false,
                  selfExpand: false,
                  desc: "Send instant replies to anyone who messages your Page<br/>Stay responsive when you don't have access to your computer or phone<br/>Show a Messenger greeting",
                  settings: [
                      {
                          desc: "Instant replies are a good way to let people know that you'll respond soon",
                          action: "switch", //dropdown, switch
                          options: [],
                          subDesc: "\"Thanks for messaging us. We try to be as responsive as possible. We'll get back to you soon\"",
                          default: false,
                          tag: "send_instant_reply"
                      },
                      {
                          desc: "Let fans and members know that you will respond soon",
                          action: "switch", //dropdown, switch
                          options: [],
                          subDesc: "\"Hi John Doe, thanks for your message. We are not here at the moment, but we'll get back to you soon!\"",
                          default: false,
                          tag: "send_instant_respond"
                      },
                      {
                          desc: "Create a greeting that people will see the first time they open a conversation with you on Messenger",
                          action: "switch", //dropdown, switch
                          options: [],
                          subDesc: "\"Hi John Doe! Thanks for getting in touch with us on Messenger. Please send us any questions you may have.\"",
                          default: false,
                          tag: "send_instant_greeting"
                      }
                  ]
              }
          ]
      }
  ],
  /*"Post Attribution":[

  ],*/
  "Notifications":[
      {
          name: "On Suptosu",
          config: [
              {
                  textOnly: true,
                  desc : "You'll see every notification on Supotsu, but you can turn off notifications about specific games, events and posts as you view them."
              },
              {
                  textOnly: true,
                  selfExpand: true,
                  desc: "Sounds",
                  settings: [
                      {
                          desc: "Play a sound when each new notification is received",
                          action: "switch", //dropdown, switch
                          options: [],
                          subDesc: false,
                          default: false,
                          tag: "sound_notice"
                      },
                      {
                          desc: "Play a sound when a message is received",
                          action: "switch", //dropdown, switch
                          options: [],
                          subDesc: false,
                          default: true,
                          tag: "sound_msg_notice"
                      }
                  ]
              },
              {
                  textOnly: true,
                  selfExpand: true,
                  desc: "What you get notified about",
                  settings: [
                      {
                          desc: "Activity that involves you",
                          action: "switch", //dropdown, switch
                          options: [],
                          subDesc: "You'll always get notifications about activity that involves you, such as when you are invited to play in a game, team or fixtures notifications or someone tags you in a photo or comments on your post",
                          default: false,
                          tag: "timeline_event_post,timeline_group_post"
                      },
                      {
                          desc: "Birthdays",
                          action: "switch", //dropdown, switch
                          options: [],
                          subDesc: "Choose whether you want to get notifications about your friends' birthdays.",
                          default: false,
                          tag: "timeline_post"
                      },
                      {
                          desc: "Close Friends activity",
                          action: "switches", //dropdown, switch
                          options: [
                              {
                                  label: "Email",
                                  default: false,
                                  tag: "friends_email"
                              },
                              {
                                  label: "Supotsu",
                                  default: false,
                                  tag: "friends_app"
                              }
                          ],
                          subDesc: "Choose whether you want to get notifications about Close Friends.",
                          default: false,
                          tag: "friends"
                      },
                      {
                          desc: "Club/Team/League activity",
                          action: "switches", //dropdown, switch
                          options: [
                              {
                                  label: "Email",
                                  default: false,
                                  tag: ""
                              },
                              {
                                  label: "Supotsu",
                                  default: false,
                                  tag: ""
                              }
                          ],
                          subDesc: "Choose whether you want to get notifications about Clubs, Teams and Leagues.",
                          default: false
                      },
                      {
                          desc: "Games",
                          action: "switch", //dropdown, switch
                          options: [],
                          subDesc: "Choose if you want to receive notifications when a game is about to start.",
                          default: false,
                          tag: "game_accept,game_invite"
                      }
                  ]
              }
          ]
      },
      {
          name: "Email Address",
          config: [
              {
                  textOnly: true,
                  desc : "To turn off a specific email notification, just click the unsubscribe link at the bottom of the email."
              },
              {
                  textOnly: true,
                  selfExpand: true,
                  rules: ["All notifications, except the ones you unsubscribe from",
                  "Important notifications about you or activity you've missed",
                  "Only notifications about your account, security and privacy"],
                  desc: "What you'll receive",
                  settings: [
                      {
                          desc: "Posts on your timeline",
                          action: "switch", //dropdown, switch
                          options: [],
                          subDesc: false,
                          default: true,
                          tag: "timeline_post"
                      },
                      {
                          desc: "Games",
                          action: "switch", //dropdown, switch
                          options: [],
                          subDesc: false,
                          default: true,
                          tag: "game_invite"
                      },
                      {
                          desc: "Posts you're tagged in",
                          action: "switch", //dropdown, switch
                          options: [],
                          subDesc: false,
                          default: false,
                          tag: "post_tag"
                      },
                      {
                          desc: "Club/Team Invitations",
                          action: "switch", //dropdown, switch
                          options: [],
                          subDesc: false,
                          default: true,
                          tag: "club_invite,team_invite,club_accept,team_accept"
                      },
                      {
                          desc: "Comments",
                          action: "switch", //dropdown, switch
                          options: [],
                          subDesc: false,
                          default: false,
                          tag: "post_comment,comment_reply"
                      },
                      {
                          desc: "Requests to join teams/Clubs/Fixtures as an admin",
                          action: "switch", //dropdown, switch
                          options: [],
                          subDesc: false,
                          default: true,
                          tag: "club_invite,team_invite,club_accept,team_accept"
                      },
                      {
                          desc: "Likes on your posts",
                          action: "switch", //dropdown, switch
                          options: [],
                          subDesc: false,
                          default: true,
                          tag: "comment_like,reply_like,post_like"
                      },{
                          desc: "Events",
                          action: "switch", //dropdown, switch
                          options: [],
                          subDesc: false,
                          default: true,
                          tag: "event_invite,event_admin_invite, event_accept"
                      },{
                          desc: "Training Material and Sessions",
                          action: "switch", //dropdown, switch
                          options: [],
                          subDesc: false,
                          default: true,
                          tag: "session_material_add,session_file_share"
                      }
                  ]
              },
          ]
      }
  ],
  "Videos":[],
  "SPAM":[],
  "Page Roles":[

  ]
}

export type SettingsKey = 'C' | 'F' | 'L' | 'I' | 'T'
export const SettingsJson: Record<SettingsKey, typeof _Profile | typeof _Page> = {
  F:_Profile,
  T: _Page,
  C: _Page,
  I: _Page,
  L: _Page,
}
