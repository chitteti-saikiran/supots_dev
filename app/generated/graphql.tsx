import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Upload: any;
};

export type Query = {
  __typename?: 'Query';
  allCommonObjects?: Maybe<Array<Maybe<CommonObject>>>;
  allCommonUsers?: Maybe<Array<Maybe<CommonUser>>>;
  allPosts?: Maybe<Array<Maybe<Post>>>;
  allSocials?: Maybe<Array<Maybe<Social>>>;
  applications?: Maybe<Array<Maybe<Application>>>;
  auth?: Maybe<User>;
  chats?: Maybe<Array<Maybe<Conversation>>>;
  club?: Maybe<Club>;
  clubs?: Maybe<Array<Maybe<Club>>>;
  commonUser?: Maybe<CommonUser>;
  documents?: Maybe<Array<Maybe<Document>>>;
  events?: Maybe<Array<Maybe<Event>>>;
  fetch?: Maybe<Scalars['String']>;
  friends?: Maybe<Array<Maybe<UserRelationship>>>;
  game?: Maybe<Game>;
  gamePosts?: Maybe<Array<Maybe<GamePost>>>;
  games?: Maybe<Array<Maybe<Game>>>;
  getRoles?: Maybe<Array<Maybe<Role>>>;
  getSetting?: Maybe<SettingItem>;
  getSettings?: Maybe<Array<Maybe<SettingItem>>>;
  hello?: Maybe<Scalars['String']>;
  institution?: Maybe<Institution>;
  institutions?: Maybe<Array<Maybe<Institution>>>;
  messages?: Maybe<MessageOuput>;
  newSessionFiles?: Maybe<Array<Maybe<SessionFile>>>;
  notice?: Maybe<Notice>;
  notices?: Maybe<Array<Maybe<Notice>>>;
  pending?: Maybe<Array<Maybe<UserRelationship>>>;
  players?: Maybe<Array<Maybe<Player>>>;
  posts?: Maybe<Array<Maybe<Post>>>;
  postsInGame?: Maybe<Array<Maybe<Post>>>;
  search?: Maybe<SearchResults>;
  season?: Maybe<Season>;
  seasonGames?: Maybe<Array<Maybe<SeasonGroupGame>>>;
  seasonGroups?: Maybe<Array<Maybe<SeasonGroup>>>;
  seasons?: Maybe<Array<Maybe<Season>>>;
  serverId?: Maybe<Scalars['String']>;
  sessionFile?: Maybe<SessionFile>;
  sessions?: Maybe<Array<Maybe<Session>>>;
  sports?: Maybe<Array<Maybe<Sport>>>;
  squad?: Maybe<Squad>;
  squadPlayers?: Maybe<Array<Maybe<Player>>>;
  squads?: Maybe<Array<Maybe<Squad>>>;
  team?: Maybe<Team>;
  teams?: Maybe<Array<Maybe<Team>>>;
  testGames?: Maybe<Array<Maybe<Game>>>;
  tournament?: Maybe<Tournament>;
  tournaments?: Maybe<Array<Maybe<Tournament>>>;
  user?: Maybe<User>;
  users?: Maybe<Array<Maybe<User>>>;
  xmppClients?: Maybe<Array<Maybe<XmppClients>>>;
};


export type QueryAllPostsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type QueryApplicationsArgs = {
  _id?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};


export type QueryAuthArgs = {
  password?: InputMaybe<Scalars['String']>;
  username?: InputMaybe<Scalars['String']>;
};


export type QueryChatsArgs = {
  _id?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};


export type QueryClubArgs = {
  _id?: InputMaybe<Scalars['String']>;
};


export type QueryClubsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type QueryCommonUserArgs = {
  _id?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};


export type QueryDocumentsArgs = {
  _id?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};


export type QueryEventsArgs = {
  _id?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};


export type QueryFetchArgs = {
  query?: InputMaybe<Request>;
};


export type QueryFriendsArgs = {
  _id?: InputMaybe<Scalars['String']>;
};


export type QueryGameArgs = {
  _id?: InputMaybe<Scalars['String']>;
};


export type QueryGamePostsArgs = {
  _id?: InputMaybe<Scalars['String']>;
};


export type QueryGamesArgs = {
  gameIds?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  user?: InputMaybe<Scalars['String']>;
};


export type QueryGetRolesArgs = {
  _id?: InputMaybe<Scalars['String']>;
};


export type QueryGetSettingArgs = {
  _id?: InputMaybe<Scalars['String']>;
  key?: InputMaybe<Scalars['String']>;
};


export type QueryGetSettingsArgs = {
  _id?: InputMaybe<Scalars['String']>;
};


export type QueryHelloArgs = {
  name?: InputMaybe<Scalars['String']>;
};


export type QueryInstitutionArgs = {
  _id?: InputMaybe<Scalars['String']>;
};


export type QueryInstitutionsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type QueryMessagesArgs = {
  _id?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type QueryNewSessionFilesArgs = {
  _id?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};


export type QueryNoticeArgs = {
  _id?: InputMaybe<Scalars['String']>;
};


export type QueryNoticesArgs = {
  _id?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};


export type QueryPendingArgs = {
  _id?: InputMaybe<Scalars['String']>;
};


export type QueryPostsArgs = {
  ids?: InputMaybe<Array<InputMaybe<PostUserType>>>;
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  user?: InputMaybe<Scalars['String']>;
};


export type QueryPostsInGameArgs = {
  _id?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
};


export type QuerySearchArgs = {
  query?: InputMaybe<Scalars['String']>;
};


export type QuerySeasonArgs = {
  _id?: InputMaybe<Scalars['String']>;
};


export type QuerySeasonGamesArgs = {
  _id?: InputMaybe<Scalars['String']>;
};


export type QuerySeasonGroupsArgs = {
  _id?: InputMaybe<Scalars['String']>;
};


export type QuerySeasonsArgs = {
  _id?: InputMaybe<Scalars['String']>;
};


export type QuerySessionFileArgs = {
  _id?: InputMaybe<Scalars['String']>;
};


export type QuerySessionsArgs = {
  _id?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};


export type QuerySquadArgs = {
  _id?: InputMaybe<Scalars['String']>;
};


export type QuerySquadPlayersArgs = {
  _id?: InputMaybe<Scalars['String']>;
};


export type QueryTeamArgs = {
  _id?: InputMaybe<Scalars['String']>;
};


export type QueryTeamsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type QueryTestGamesArgs = {
  user?: InputMaybe<Scalars['String']>;
};


export type QueryTournamentArgs = {
  _id?: InputMaybe<Scalars['String']>;
};


export type QueryTournamentsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type QueryUserArgs = {
  _id?: InputMaybe<Scalars['String']>;
};

export type CommonObject = {
  __typename?: 'CommonObject';
  _id?: Maybe<Scalars['ID']>;
  CHAT?: Maybe<Conversation>;
  CLUB?: Maybe<Club>;
  date?: Maybe<Scalars['String']>;
  EVENT?: Maybe<Event>;
  FILE?: Maybe<File>;
  GAME_POST?: Maybe<Post>;
  GMC_POST?: Maybe<Post>;
  INSTITUTION?: Maybe<Institution>;
  POST?: Maybe<Post>;
  SESSION?: Maybe<Session>;
  SESSIONFILE?: Maybe<SessionFile>;
  status?: Maybe<Scalars['String']>;
  TEAM?: Maybe<Team>;
  TOURN?: Maybe<Tournament>;
  type?: Maybe<Scalars['String']>;
};

export type Conversation = {
  __typename?: 'Conversation';
  _id?: Maybe<Scalars['ID']>;
  color?: Maybe<Scalars['String']>;
  creator?: Maybe<User>;
  date?: Maybe<Scalars['String']>;
  group?: Maybe<GroupChat>;
  isGroup?: Maybe<Scalars['Boolean']>;
  isPage?: Maybe<Scalars['Boolean']>;
  last_message?: Maybe<Message>;
  messages?: Maybe<Array<Maybe<Message>>>;
  removed?: Maybe<Array<Maybe<User>>>;
  settings?: Maybe<Array<Maybe<Settings>>>;
  status?: Maybe<Scalars['String']>;
  team?: Maybe<Team>;
  type?: Maybe<Scalars['String']>;
  user?: Maybe<CommonUser>;
  user_deleted?: Maybe<Array<Maybe<Scalars['String']>>>;
  users?: Maybe<Array<Maybe<User>>>;
  userTo?: Maybe<CommonUser>;
  usertype?: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  _id?: Maybe<Scalars['ID']>;
  about?: Maybe<Scalars['String']>;
  aboutPrivacy?: Maybe<Scalars['String']>;
  address?: Maybe<Scalars['String']>;
  auth0?: Maybe<Scalars['String']>;
  bg_image?: Maybe<Scalars['String']>;
  birth_month?: Maybe<Scalars['String']>;
  birth_year?: Maybe<Scalars['String']>;
  children?: Maybe<Array<Maybe<Role>>>;
  clubs?: Maybe<Array<Maybe<Club>>>;
  clubsFollowed?: Maybe<Array<Maybe<CommonUser>>>;
  coaches?: Maybe<Array<Maybe<Role>>>;
  coaching?: Maybe<Array<Maybe<Role>>>;
  contacts?: Maybe<Contacts>;
  convo?: Maybe<Conversation>;
  coord?: Maybe<Coord>;
  country?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  device_ids?: Maybe<Array<Maybe<Scalars['String']>>>;
  dob?: Maybe<Scalars['String']>;
  education?: Maybe<UserEducation>;
  email?: Maybe<Scalars['String']>;
  events?: Maybe<Array<Maybe<Event>>>;
  family?: Maybe<Array<Maybe<Relation>>>;
  first_name?: Maybe<Scalars['String']>;
  followers?: Maybe<Array<Maybe<Follower>>>;
  friends?: Maybe<Array<Maybe<Relation>>>;
  games?: Maybe<Array<Maybe<Game>>>;
  grounds?: Maybe<Array<Maybe<Ground>>>;
  groups?: Maybe<Array<Maybe<Group>>>;
  hash_key?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  institutions?: Maybe<Array<Maybe<Institution>>>;
  institutionsFollowed?: Maybe<Array<Maybe<CommonUser>>>;
  isAdmin?: Maybe<Scalars['Boolean']>;
  isCoach?: Maybe<Scalars['Boolean']>;
  isGuest?: Maybe<Scalars['Boolean']>;
  isMaster?: Maybe<Scalars['Boolean']>;
  isParent?: Maybe<Scalars['Boolean']>;
  isUnderAge?: Maybe<Scalars['Boolean']>;
  isVerified?: Maybe<Scalars['Boolean']>;
  last_name?: Maybe<Scalars['String']>;
  leagues?: Maybe<Array<Maybe<Tournament>>>;
  leaguesFollowed?: Maybe<Array<Maybe<CommonUser>>>;
  likes?: Maybe<Array<Maybe<Like>>>;
  messages?: Maybe<Array<Maybe<Conversation>>>;
  mobile?: Maybe<Scalars['String']>;
  mySport?: Maybe<Array<Maybe<SportPlay>>>;
  myTeams?: Maybe<Array<Maybe<TeamPlay>>>;
  name?: Maybe<Scalars['String']>;
  notices?: Maybe<Array<Maybe<Notice>>>;
  online?: Maybe<Array<Maybe<Scalars['String']>>>;
  ownTeams?: Maybe<Array<Maybe<Team>>>;
  pages?: Maybe<Array<Maybe<Role>>>;
  ParentApproved?: Maybe<Scalars['String']>;
  parents?: Maybe<Array<Maybe<Role>>>;
  phone?: Maybe<Scalars['String']>;
  placesLived?: Maybe<PlacesLived>;
  player?: Maybe<Player>;
  postal?: Maybe<Scalars['String']>;
  posts?: Maybe<Array<Maybe<Post>>>;
  relations?: Maybe<Array<Maybe<Relation>>>;
  roles?: Maybe<Array<Maybe<Role>>>;
  settings?: Maybe<Array<Maybe<Settings>>>;
  sportsFollowed?: Maybe<Array<Maybe<Sport>>>;
  state?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  suburb?: Maybe<Scalars['String']>;
  teamsFollowed?: Maybe<Array<Maybe<CommonUser>>>;
  type?: Maybe<Scalars['String']>;
  user_gender?: Maybe<Scalars['String']>;
  user_height?: Maybe<Scalars['String']>;
  user_weight?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
  website?: Maybe<Scalars['String']>;
  work?: Maybe<UserWork>;
};

export type Role = {
  __typename?: 'Role';
  _id?: Maybe<Scalars['ID']>;
  content?: Maybe<CommonUser>;
  date?: Maybe<Scalars['String']>;
  role?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
};

export type CommonUser = {
  __typename?: 'CommonUser';
  _id?: Maybe<Scalars['ID']>;
  C?: Maybe<Club>;
  E?: Maybe<Event>;
  F?: Maybe<User>;
  G?: Maybe<Game>;
  I?: Maybe<Institution>;
  L?: Maybe<Tournament>;
  posts?: Maybe<Array<Maybe<Post>>>;
  Q?: Maybe<Group>;
  status?: Maybe<Scalars['String']>;
  T?: Maybe<Team>;
  type?: Maybe<Scalars['String']>;
};

export type Club = {
  __typename?: 'Club';
  _id?: Maybe<Scalars['ID']>;
  about?: Maybe<Scalars['String']>;
  address?: Maybe<Scalars['String']>;
  bg_color?: Maybe<Scalars['String']>;
  captain?: Maybe<User>;
  color?: Maybe<Scalars['String']>;
  contactMain?: Maybe<Scalars['String']>;
  contactOther?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  cropped?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  didVisit?: Maybe<Scalars['Boolean']>;
  email?: Maybe<Scalars['String']>;
  establishMonth?: Maybe<Scalars['String']>;
  establishYear?: Maybe<Scalars['String']>;
  fans?: Maybe<Array<Maybe<Fan>>>;
  followers?: Maybe<Array<Maybe<Follower>>>;
  ground?: Maybe<Ground>;
  image?: Maybe<Scalars['String']>;
  isAdmin?: Maybe<Scalars['Boolean']>;
  isFollowed?: Maybe<Scalars['Boolean']>;
  isLiked?: Maybe<Scalars['Boolean']>;
  isVerified?: Maybe<Scalars['Boolean']>;
  level?: Maybe<Scalars['String']>;
  likes?: Maybe<Array<Maybe<Like>>>;
  location?: Maybe<Scalars['String']>;
  manager?: Maybe<User>;
  messages?: Maybe<Array<Maybe<Conversation>>>;
  name?: Maybe<Scalars['String']>;
  postal?: Maybe<Scalars['String']>;
  posts?: Maybe<Array<Maybe<Post>>>;
  roles?: Maybe<Array<Maybe<Role>>>;
  secretary?: Maybe<User>;
  settings?: Maybe<Array<Maybe<Settings>>>;
  socials?: Maybe<Array<Maybe<Social>>>;
  sports?: Maybe<Array<Maybe<ClubSport>>>;
  state?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  suburb?: Maybe<Scalars['String']>;
  teams?: Maybe<ClubTeams>;
  type?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
  website?: Maybe<Scalars['String']>;
};

export type Fan = {
  __typename?: 'Fan';
  _id?: Maybe<Scalars['ID']>;
  page?: Maybe<CommonUser>;
  points?: Maybe<Scalars['Float']>;
  user?: Maybe<CommonUser>;
};

export type Follower = {
  __typename?: 'Follower';
  _id?: Maybe<Scalars['ID']>;
  comment?: Maybe<Comment>;
  date?: Maybe<Scalars['String']>;
  file?: Maybe<File>;
  GAME_POST?: Maybe<Post>;
  GMC_POST?: Maybe<Post>;
  photo?: Maybe<Post>;
  post?: Maybe<Post>;
  profile?: Maybe<CommonUser>;
  reply?: Maybe<Reply>;
  sessionfile?: Maybe<SessionFile>;
  status?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  user?: Maybe<CommonUser>;
  video?: Maybe<Video>;
};

export type Comment = {
  __typename?: 'Comment';
  _id?: Maybe<Scalars['ID']>;
  content?: Maybe<Scalars['String']>;
  contentUsers?: Maybe<Array<Maybe<CommonUser>>>;
  date?: Maybe<Scalars['String']>;
  hasLink?: Maybe<Scalars['Boolean']>;
  likes?: Maybe<Array<Maybe<Like>>>;
  links?: Maybe<Array<Maybe<Link>>>;
  media?: Maybe<File>;
  owner?: Maybe<CommonUser>;
  rawContent?: Maybe<Scalars['String']>;
  replies?: Maybe<Array<Maybe<Reply>>>;
  status?: Maybe<Scalars['String']>;
  tag?: Maybe<Scalars['String']>;
  team?: Maybe<Team>;
  timeAgo?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  user?: Maybe<CommonUser>;
  users?: Maybe<Array<Maybe<CommonUser>>>;
  userTo?: Maybe<CommonUser>;
};

export type Like = {
  __typename?: 'Like';
  _id?: Maybe<Scalars['ID']>;
  comment?: Maybe<Comment>;
  date?: Maybe<Scalars['String']>;
  file?: Maybe<File>;
  GAME_POST?: Maybe<Post>;
  GMC_POST?: Maybe<Post>;
  photo?: Maybe<Post>;
  post?: Maybe<Post>;
  profile?: Maybe<CommonUser>;
  reply?: Maybe<Reply>;
  sessionfile?: Maybe<SessionFile>;
  status?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  user?: Maybe<CommonUser>;
  video?: Maybe<Video>;
};

export type File = {
  __typename?: 'File';
  _id?: Maybe<Scalars['ID']>;
  date?: Maybe<Scalars['String']>;
  height?: Maybe<Scalars['Float']>;
  location?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  object_type?: Maybe<Scalars['String']>;
  orientation?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<CommonUser>>>;
  type?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  user?: Maybe<CommonUser>;
  userTo?: Maybe<CommonUser>;
  video?: Maybe<Video>;
  width?: Maybe<Scalars['Float']>;
};

export type Video = {
  __typename?: 'Video';
  _id?: Maybe<Scalars['ID']>;
  block?: Maybe<Array<Maybe<Scalars['String']>>>;
  comments?: Maybe<Array<Maybe<Comment>>>;
  date?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['String']>;
  feature_user?: Maybe<User>;
  has_chat?: Maybe<Scalars['Boolean']>;
  hls?: Maybe<Scalars['String']>;
  is_live?: Maybe<Scalars['Boolean']>;
  is_recorded?: Maybe<Scalars['Boolean']>;
  is_saved?: Maybe<Scalars['Boolean']>;
  location?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  poster?: Maybe<Scalars['String']>;
  sport?: Maybe<Scalars['String']>;
  src?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<Scalars['String']>>>;
  user?: Maybe<User>;
  users?: Maybe<Array<Maybe<User>>>;
  views?: Maybe<Scalars['Int']>;
  watchers?: Maybe<Scalars['Int']>;
};

export type Post = {
  __typename?: 'Post';
  _id?: Maybe<Scalars['ID']>;
  audience?: Maybe<Scalars['String']>;
  audience_list?: Maybe<Array<Maybe<Scalars['String']>>>;
  comments?: Maybe<Array<Maybe<Comment>>>;
  commentType?: Maybe<Scalars['String']>;
  content?: Maybe<Scalars['String']>;
  contentUsers?: Maybe<Array<Maybe<CommonUser>>>;
  coord?: Maybe<Coord>;
  date?: Maybe<Scalars['String']>;
  file?: Maybe<File>;
  hashtags?: Maybe<Array<Maybe<Scalars['String']>>>;
  hasLink?: Maybe<Scalars['Boolean']>;
  is_live?: Maybe<Scalars['Boolean']>;
  isEvent?: Maybe<Scalars['Boolean']>;
  isGAME?: Maybe<Scalars['Boolean']>;
  isGMC?: Maybe<Scalars['Boolean']>;
  isLiked?: Maybe<Scalars['Boolean']>;
  isShared?: Maybe<Scalars['Boolean']>;
  isTagged?: Maybe<Scalars['Boolean']>;
  likes?: Maybe<Array<Maybe<Like>>>;
  links?: Maybe<Array<Maybe<Link>>>;
  media?: Maybe<Array<Maybe<File>>>;
  minute?: Maybe<Scalars['Int']>;
  owner?: Maybe<CommonUser>;
  pages?: Maybe<Array<Maybe<Scalars['String']>>>;
  place?: Maybe<Scalars['String']>;
  postType?: Maybe<Scalars['String']>;
  rawContent?: Maybe<Scalars['String']>;
  sharedObject?: Maybe<CommonObject>;
  shares?: Maybe<Array<Maybe<Share>>>;
  shareType?: Maybe<Scalars['String']>;
  skills?: Maybe<Array<Maybe<Scalars['String']>>>;
  sport?: Maybe<Sport>;
  status?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<Scalars['String']>>>;
  timeAgo?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  user?: Maybe<CommonUser>;
  users?: Maybe<Array<Maybe<CommonUser>>>;
  userTo?: Maybe<CommonUser>;
  video?: Maybe<Video>;
  video_id?: Maybe<Scalars['String']>;
  views?: Maybe<Array<Maybe<View>>>;
};

export type Coord = {
  __typename?: 'Coord';
  _id?: Maybe<Scalars['ID']>;
  lat?: Maybe<Scalars['String']>;
  lng?: Maybe<Scalars['String']>;
};

export type Link = {
  __typename?: 'Link';
  _id?: Maybe<Scalars['ID']>;
  date?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  images?: Maybe<Array<Maybe<Scalars['String']>>>;
  status?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  user?: Maybe<CommonUser>;
};

export type Share = {
  __typename?: 'Share';
  _id?: Maybe<Scalars['ID']>;
  comment?: Maybe<Comment>;
  date?: Maybe<Scalars['String']>;
  file?: Maybe<File>;
  GAME_POST?: Maybe<Post>;
  GMC_POST?: Maybe<Post>;
  photo?: Maybe<Post>;
  post?: Maybe<Post>;
  profile?: Maybe<CommonUser>;
  reply?: Maybe<Reply>;
  sessionfile?: Maybe<SessionFile>;
  status?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  user?: Maybe<CommonUser>;
  video?: Maybe<Video>;
};

export type Reply = {
  __typename?: 'Reply';
  _id?: Maybe<Scalars['ID']>;
  content?: Maybe<Scalars['String']>;
  contentUsers?: Maybe<Array<Maybe<CommonUser>>>;
  date?: Maybe<Scalars['String']>;
  hasLink?: Maybe<Scalars['Boolean']>;
  likes?: Maybe<Array<Maybe<Like>>>;
  links?: Maybe<Array<Maybe<Link>>>;
  media?: Maybe<File>;
  owner?: Maybe<CommonUser>;
  rawContent?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  timeAgo?: Maybe<Scalars['String']>;
  user?: Maybe<CommonUser>;
  userTo?: Maybe<CommonUser>;
};

export type SessionFile = {
  __typename?: 'SessionFile';
  _id?: Maybe<Scalars['ID']>;
  commentCount?: Maybe<Scalars['Int']>;
  comments?: Maybe<Array<Maybe<Comment>>>;
  commentType?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  file?: Maybe<File>;
  isFavoured?: Maybe<Scalars['Boolean']>;
  isLink?: Maybe<Scalars['Boolean']>;
  isOwner?: Maybe<Scalars['Boolean']>;
  likeCount?: Maybe<Scalars['Int']>;
  likes?: Maybe<Array<Maybe<Like>>>;
  link?: Maybe<Scalars['String']>;
  session?: Maybe<Session>;
  shares?: Maybe<Array<Maybe<Share>>>;
  sport?: Maybe<Sport>;
  sportToSee?: Maybe<Array<Maybe<Sport>>>;
  status?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<Scalars['String']>>>;
  teamToSee?: Maybe<Array<Maybe<Team>>>;
  title?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
  users?: Maybe<Array<Maybe<User>>>;
};

export type Session = {
  __typename?: 'Session';
  _id?: Maybe<Scalars['ID']>;
  date?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  files?: Maybe<Array<Maybe<SessionFile>>>;
  image?: Maybe<File>;
  name?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  timeAgo?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
  users?: Maybe<Array<Maybe<CommonUser>>>;
  userTo?: Maybe<CommonUser>;
};

export type Sport = {
  __typename?: 'Sport';
  _id?: Maybe<Scalars['ID']>;
  color?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  halves?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  positions?: Maybe<Array<Maybe<Scalars['String']>>>;
  status?: Maybe<Scalars['String']>;
};

export type Team = {
  __typename?: 'Team';
  _id?: Maybe<Scalars['ID']>;
  about?: Maybe<Scalars['String']>;
  activeSquad?: Maybe<Squad>;
  address?: Maybe<Scalars['String']>;
  bg_color?: Maybe<Scalars['String']>;
  captain?: Maybe<User>;
  color?: Maybe<Scalars['String']>;
  contactMain?: Maybe<Scalars['String']>;
  contactOther?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  cropped?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  didVisit?: Maybe<Scalars['Boolean']>;
  email?: Maybe<Scalars['String']>;
  establishMonth?: Maybe<Scalars['String']>;
  establishYear?: Maybe<Scalars['String']>;
  fans?: Maybe<Array<Maybe<Fan>>>;
  followers?: Maybe<Array<Maybe<Follower>>>;
  ground?: Maybe<Ground>;
  image?: Maybe<Scalars['String']>;
  isAdmin?: Maybe<Scalars['Boolean']>;
  isFan?: Maybe<Scalars['Boolean']>;
  isFollowed?: Maybe<Scalars['Boolean']>;
  isLiked?: Maybe<Scalars['Boolean']>;
  isVerified?: Maybe<Scalars['Boolean']>;
  likes?: Maybe<Array<Maybe<Like>>>;
  location?: Maybe<Scalars['String']>;
  manager?: Maybe<User>;
  messages?: Maybe<Array<Maybe<Conversation>>>;
  name?: Maybe<Scalars['String']>;
  postal?: Maybe<Scalars['String']>;
  posts?: Maybe<Array<Maybe<Post>>>;
  roles?: Maybe<Array<Maybe<Role>>>;
  secretary?: Maybe<User>;
  settings?: Maybe<Array<Maybe<Settings>>>;
  socials?: Maybe<Array<Maybe<Social>>>;
  sport?: Maybe<Sport>;
  squads?: Maybe<TeamSquadList>;
  state?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  suburb?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
  website?: Maybe<Scalars['String']>;
};

export type Squad = {
  __typename?: 'Squad';
  _id?: Maybe<Scalars['ID']>;
  acts?: Maybe<Array<Maybe<GameAction>>>;
  age?: Maybe<Scalars['String']>;
  assCoach?: Maybe<User>;
  captain?: Maybe<User>;
  coach?: Maybe<User>;
  date?: Maybe<Scalars['String']>;
  entry?: Maybe<Scalars['String']>;
  games?: Maybe<Array<Maybe<Game>>>;
  gender?: Maybe<Scalars['String']>;
  lineup?: Maybe<Array<Maybe<Player>>>;
  name?: Maybe<Scalars['String']>;
  players?: Maybe<Array<Maybe<Player>>>;
  roles?: Maybe<Array<Maybe<Role>>>;
  status?: Maybe<Scalars['String']>;
  subs?: Maybe<Array<Maybe<Player>>>;
  year?: Maybe<Scalars['String']>;
};

export type GameAction = {
  __typename?: 'GameAction';
  _id?: Maybe<Scalars['ID']>;
  comments?: Maybe<Array<Maybe<Comment>>>;
  game?: Maybe<Game>;
  gameStage?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
  likes?: Maybe<Array<Maybe<Like>>>;
  player?: Maybe<Player>;
  second_player?: Maybe<Player>;
  shares?: Maybe<Array<Maybe<Share>>>;
  squad?: Maybe<Squad>;
  team?: Maybe<Team>;
  time?: Maybe<Scalars['Int']>;
  type?: Maybe<Scalars['String']>;
};

export type Game = {
  __typename?: 'Game';
  _id?: Maybe<Scalars['ID']>;
  currentQuarter?: Maybe<Scalars['Int']>;
  currentTime?: Maybe<Scalars['Int']>;
  date?: Maybe<Scalars['String']>;
  duration?: Maybe<Scalars['Int']>;
  endDate?: Maybe<Scalars['Int']>;
  followers?: Maybe<Array<Maybe<Follower>>>;
  fullDate?: Maybe<Scalars['String']>;
  homeTeam?: Maybe<Team>;
  isEnded?: Maybe<Scalars['Boolean']>;
  isFinished?: Maybe<Scalars['Boolean']>;
  isLeague?: Maybe<Scalars['Boolean']>;
  isPlaying?: Maybe<Scalars['Boolean']>;
  isTournament?: Maybe<Scalars['Boolean']>;
  likes?: Maybe<Array<Maybe<Like>>>;
  matchAdmin?: Maybe<User>;
  matchDate?: Maybe<Scalars['String']>;
  matchExtra?: Maybe<Scalars['Int']>;
  matchHalf?: Maybe<Scalars['Int']>;
  matchPlace?: Maybe<Ground>;
  matchTime?: Maybe<Scalars['Int']>;
  matchType?: Maybe<Scalars['String']>;
  players?: Maybe<GamePlayers>;
  posts?: Maybe<Array<Maybe<Post>>>;
  quarter?: Maybe<Scalars['Int']>;
  ref?: Maybe<User>;
  ref_left?: Maybe<User>;
  ref_right?: Maybe<User>;
  sport?: Maybe<Sport>;
  squadOne?: Maybe<Squad>;
  squadTwo?: Maybe<Squad>;
  state?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  teamOne?: Maybe<Team>;
  teamOneActs?: Maybe<Array<Maybe<GameAction>>>;
  teamOnePosition?: Maybe<Scalars['String']>;
  teamOneShootouts?: Maybe<Array<Maybe<GameShootoutAction>>>;
  teamTwo?: Maybe<Team>;
  teamTwoActs?: Maybe<Array<Maybe<GameAction>>>;
  teamTwoPosition?: Maybe<Scalars['String']>;
  teamTwoShootouts?: Maybe<Array<Maybe<GameShootoutAction>>>;
  title?: Maybe<Scalars['String']>;
  tournament?: Maybe<Tournament>;
  type?: Maybe<Scalars['String']>;
};

export type Ground = {
  __typename?: 'Ground';
  _id?: Maybe<Scalars['ID']>;
  address?: Maybe<Scalars['String']>;
  coord?: Maybe<Coord>;
  date?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
};

export type GamePlayers = {
  __typename?: 'GamePlayers';
  _id?: Maybe<Scalars['ID']>;
  date?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  teamOne?: Maybe<GameTeamPlayers>;
  teamTwo?: Maybe<GameTeamPlayers>;
};

export type GameTeamPlayers = {
  __typename?: 'GameTeamPlayers';
  _id?: Maybe<Scalars['ID']>;
  date?: Maybe<Scalars['String']>;
  lineup?: Maybe<Array<Maybe<Player>>>;
  status?: Maybe<Scalars['String']>;
  subs?: Maybe<Array<Maybe<Player>>>;
};

export type Player = {
  __typename?: 'Player';
  _id?: Maybe<Scalars['ID']>;
  acts?: Maybe<Array<Maybe<GameAction>>>;
  dob?: Maybe<Scalars['String']>;
  games?: Maybe<Array<Maybe<Game>>>;
  height?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  number?: Maybe<Scalars['String']>;
  origin?: Maybe<Scalars['String']>;
  parents?: Maybe<Array<Maybe<Role>>>;
  position?: Maybe<Scalars['String']>;
  shootouts?: Maybe<Array<Maybe<GameShootoutAction>>>;
  user?: Maybe<User>;
  userId?: Maybe<Scalars['String']>;
  x?: Maybe<Scalars['Float']>;
  y?: Maybe<Scalars['Float']>;
};

export type GameShootoutAction = {
  __typename?: 'GameShootoutAction';
  _id?: Maybe<Scalars['ID']>;
  game?: Maybe<Game>;
  isGoal?: Maybe<Scalars['Boolean']>;
  player?: Maybe<Player>;
  squad?: Maybe<Squad>;
  team?: Maybe<Team>;
  time?: Maybe<Scalars['Int']>;
};

export type Tournament = {
  __typename?: 'Tournament';
  _id?: Maybe<Scalars['ID']>;
  about?: Maybe<Scalars['String']>;
  address?: Maybe<Scalars['String']>;
  admin?: Maybe<User>;
  bg_color?: Maybe<Scalars['String']>;
  color?: Maybe<Scalars['String']>;
  contactMain?: Maybe<Scalars['String']>;
  contactOther?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  cropped?: Maybe<Scalars['String']>;
  currentSeason?: Maybe<Season>;
  date?: Maybe<Scalars['String']>;
  didVisit?: Maybe<Scalars['Boolean']>;
  email?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['String']>;
  establishMonth?: Maybe<Scalars['String']>;
  establishYear?: Maybe<Scalars['String']>;
  fans?: Maybe<Array<Maybe<Fan>>>;
  followers?: Maybe<Array<Maybe<Follower>>>;
  gender?: Maybe<Scalars['String']>;
  groups?: Maybe<Array<Maybe<TournamentGroup>>>;
  hasCurrentSeason?: Maybe<Scalars['Boolean']>;
  hasCurrentSeasonStarted?: Maybe<Scalars['Boolean']>;
  hasSeason?: Maybe<Scalars['Boolean']>;
  hasTeams?: Maybe<Scalars['Boolean']>;
  image?: Maybe<Scalars['String']>;
  isAdmin?: Maybe<Scalars['Boolean']>;
  isFollowed?: Maybe<Scalars['Boolean']>;
  isLiked?: Maybe<Scalars['Boolean']>;
  isVerified?: Maybe<Scalars['Boolean']>;
  level?: Maybe<Scalars['String']>;
  likes?: Maybe<Array<Maybe<Like>>>;
  location?: Maybe<Scalars['String']>;
  manager?: Maybe<User>;
  messages?: Maybe<Array<Maybe<Conversation>>>;
  mode?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  noOfLegs?: Maybe<Scalars['String']>;
  noOfTeams?: Maybe<Scalars['Int']>;
  notices?: Maybe<Array<Maybe<Notice>>>;
  playOffs?: Maybe<TournamentPlayOffs>;
  postal?: Maybe<Scalars['String']>;
  posts?: Maybe<Array<Maybe<Post>>>;
  roles?: Maybe<Array<Maybe<Role>>>;
  seasons?: Maybe<Array<Maybe<Season>>>;
  secretary?: Maybe<User>;
  settings?: Maybe<Array<Maybe<Settings>>>;
  socials?: Maybe<Array<Maybe<Social>>>;
  sport?: Maybe<Sport>;
  startDate?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  suburb?: Maybe<Scalars['String']>;
  teams?: Maybe<Array<Maybe<TournamentTeam>>>;
  type?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
  website?: Maybe<Scalars['String']>;
};

export type Season = {
  __typename?: 'Season';
  _id?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  finished?: Maybe<Scalars['Boolean']>;
  hasGames?: Maybe<Scalars['Boolean']>;
  isPast?: Maybe<Scalars['Boolean']>;
  league?: Maybe<Tournament>;
  legs?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  noOfTeams?: Maybe<Scalars['Int']>;
  started?: Maybe<Scalars['Boolean']>;
  status?: Maybe<Scalars['String']>;
  teams?: Maybe<Array<Maybe<Team>>>;
  type?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
};

export type TournamentGroup = {
  __typename?: 'TournamentGroup';
  _id?: Maybe<Scalars['ID']>;
};

export type Notice = {
  __typename?: 'Notice';
  _id?: Maybe<Scalars['ID']>;
  actionData?: Maybe<NoticeActionData>;
  context?: Maybe<NoticeContext>;
  date?: Maybe<Scalars['String']>;
  otherUser?: Maybe<CommonUser>;
  status?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  user?: Maybe<CommonUser>;
};

export type NoticeActionData = {
  __typename?: 'NoticeActionData';
  context?: Maybe<Scalars['String']>;
  contextId?: Maybe<Scalars['String']>;
  contextTarget?: Maybe<CommonObject>;
  isBlock?: Maybe<Scalars['Boolean']>;
};

export type NoticeContext = {
  __typename?: 'NoticeContext';
  body?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

export type TournamentPlayOffs = {
  __typename?: 'TournamentPlayOffs';
  final?: Maybe<Array<Maybe<PlayOff>>>;
  losers?: Maybe<Array<Maybe<PlayOff>>>;
  quarter?: Maybe<Array<Maybe<PlayOff>>>;
  round?: Maybe<Array<Maybe<PlayOff>>>;
  semi?: Maybe<Array<Maybe<PlayOff>>>;
};

export type PlayOff = {
  __typename?: 'PlayOff';
  _id?: Maybe<Scalars['ID']>;
  date?: Maybe<Scalars['String']>;
  game?: Maybe<Game>;
  status?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type Settings = {
  __typename?: 'Settings';
  _id?: Maybe<Scalars['ID']>;
};

export type Social = {
  __typename?: 'Social';
  _id?: Maybe<Scalars['ID']>;
  date?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  user?: Maybe<CommonUser>;
  value?: Maybe<Scalars['String']>;
};

export type TournamentTeam = {
  __typename?: 'TournamentTeam';
  _id?: Maybe<Scalars['ID']>;
  date?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
};

export type TeamSquadList = {
  __typename?: 'TeamSquadList';
  current?: Maybe<Array<Maybe<Squad>>>;
  past?: Maybe<Array<Maybe<Squad>>>;
};

export type View = {
  __typename?: 'View';
  _id?: Maybe<Scalars['ID']>;
  comment?: Maybe<Comment>;
  date?: Maybe<Scalars['String']>;
  file?: Maybe<File>;
  GAME_POST?: Maybe<Post>;
  GMC_POST?: Maybe<Post>;
  photo?: Maybe<Post>;
  post?: Maybe<Post>;
  profile?: Maybe<CommonUser>;
  reply?: Maybe<Reply>;
  sessionfile?: Maybe<SessionFile>;
  status?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  user?: Maybe<CommonUser>;
  video?: Maybe<Video>;
};

export type ClubSport = {
  __typename?: 'ClubSport';
  _id?: Maybe<Scalars['ID']>;
  assCoach?: Maybe<User>;
  assHeadOfDept?: Maybe<User>;
  date?: Maybe<Scalars['String']>;
  headCoach?: Maybe<User>;
  headOfDept?: Maybe<User>;
  rawId?: Maybe<Scalars['String']>;
  sport?: Maybe<Sport>;
  status?: Maybe<Scalars['String']>;
};

export type ClubTeams = {
  __typename?: 'ClubTeams';
  current?: Maybe<Array<Maybe<Team>>>;
  past?: Maybe<Array<Maybe<Team>>>;
};

export type Event = {
  __typename?: 'Event';
  _id?: Maybe<Scalars['ID']>;
  coach?: Maybe<User>;
  color?: Maybe<Scalars['String']>;
  coord?: Maybe<CoordExt>;
  created?: Maybe<User>;
  created_at?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  day?: Maybe<Scalars['String']>;
  dayString?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['String']>;
  e_day?: Maybe<Scalars['String']>;
  e_month?: Maybe<Scalars['String']>;
  e_year?: Maybe<Scalars['String']>;
  end_timestamp?: Maybe<Scalars['String']>;
  endFullTimestamp?: Maybe<Scalars['String']>;
  endTime?: Maybe<Scalars['String']>;
  event_type?: Maybe<Scalars['String']>;
  file?: Maybe<File>;
  followers?: Maybe<Array<Maybe<Follower>>>;
  fullTimestamp?: Maybe<Scalars['String']>;
  invites?: Maybe<Array<Maybe<EventInvite>>>;
  isAdmin?: Maybe<Scalars['Boolean']>;
  isGame?: Maybe<Scalars['Boolean']>;
  isOneDay?: Maybe<Scalars['Boolean']>;
  isPast?: Maybe<Scalars['Boolean']>;
  isToday?: Maybe<Scalars['Boolean']>;
  likes?: Maybe<Array<Maybe<Like>>>;
  managers?: Maybe<Array<Maybe<User>>>;
  month?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  now?: Maybe<Scalars['String']>;
  place?: Maybe<Place>;
  players?: Maybe<Array<Maybe<Player>>>;
  posts?: Maybe<Array<Maybe<Post>>>;
  startTime?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  team?: Maybe<Team>;
  teams?: Maybe<Array<Maybe<Team>>>;
  timestamp?: Maybe<Scalars['String']>;
  todayFullstamp?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  user?: Maybe<CommonUser>;
  year?: Maybe<Scalars['String']>;
};

export type CoordExt = {
  __typename?: 'CoordExt';
  lat?: Maybe<Scalars['String']>;
  lon?: Maybe<Scalars['String']>;
};

export type EventInvite = {
  __typename?: 'EventInvite';
  _id?: Maybe<Scalars['ID']>;
  date?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
};

export type Place = {
  __typename?: 'Place';
  _id?: Maybe<Scalars['ID']>;
  address?: Maybe<Scalars['String']>;
  coord?: Maybe<Coord>;
  date?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  rawKey?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
};

export type Institution = {
  __typename?: 'Institution';
  _id?: Maybe<Scalars['ID']>;
  about?: Maybe<Scalars['String']>;
  address?: Maybe<Scalars['String']>;
  bg_color?: Maybe<Scalars['String']>;
  captain?: Maybe<User>;
  color?: Maybe<Scalars['String']>;
  contactMain?: Maybe<Scalars['String']>;
  contactOther?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  cropped?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  didVisit?: Maybe<Scalars['Boolean']>;
  email?: Maybe<Scalars['String']>;
  establishMonth?: Maybe<Scalars['String']>;
  establishYear?: Maybe<Scalars['String']>;
  fans?: Maybe<Array<Maybe<Fan>>>;
  followers?: Maybe<Array<Maybe<Follower>>>;
  ground?: Maybe<Ground>;
  image?: Maybe<Scalars['String']>;
  isAdmin?: Maybe<Scalars['Boolean']>;
  isFollowed?: Maybe<Scalars['Boolean']>;
  isLiked?: Maybe<Scalars['Boolean']>;
  isVerified?: Maybe<Scalars['Boolean']>;
  level?: Maybe<Scalars['String']>;
  likes?: Maybe<Array<Maybe<Like>>>;
  location?: Maybe<Scalars['String']>;
  manager?: Maybe<User>;
  messages?: Maybe<Array<Maybe<Conversation>>>;
  name?: Maybe<Scalars['String']>;
  postal?: Maybe<Scalars['String']>;
  posts?: Maybe<Array<Maybe<Post>>>;
  roles?: Maybe<Array<Maybe<Role>>>;
  secretary?: Maybe<User>;
  settings?: Maybe<Array<Maybe<Settings>>>;
  socials?: Maybe<Array<Maybe<Social>>>;
  sports?: Maybe<Array<Maybe<ClubSport>>>;
  state?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  suburb?: Maybe<Scalars['String']>;
  teams?: Maybe<ClubTeams>;
  type?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
  website?: Maybe<Scalars['String']>;
};

export type Group = {
  __typename?: 'Group';
  _id?: Maybe<Scalars['ID']>;
  date?: Maybe<Scalars['String']>;
  followers?: Maybe<Array<Maybe<Follower>>>;
  likes?: Maybe<Array<Maybe<Like>>>;
  posts?: Maybe<Array<Maybe<Post>>>;
  status?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type Contacts = {
  __typename?: 'Contacts';
  personal?: Maybe<Array<Maybe<PersonalContact>>>;
  social?: Maybe<Array<Maybe<Social>>>;
};

export type PersonalContact = {
  __typename?: 'PersonalContact';
  _id?: Maybe<Scalars['ID']>;
  date?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  privacy?: Maybe<Scalars['String']>;
  rawKey?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type UserEducation = {
  __typename?: 'UserEducation';
  current?: Maybe<Education>;
  others?: Maybe<Array<Maybe<Education>>>;
  past?: Maybe<Education>;
};

export type Education = {
  __typename?: 'Education';
  _id?: Maybe<Scalars['ID']>;
  city?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  isCurrent?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  period?: Maybe<WorkPeroid>;
  status?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  year?: Maybe<Scalars['String']>;
};

export type WorkPeroid = {
  __typename?: 'WorkPeroid';
  from?: Maybe<Scalars['String']>;
  to?: Maybe<Scalars['String']>;
};

export type Relation = {
  __typename?: 'Relation';
  _id?: Maybe<Scalars['ID']>;
};

export type SportPlay = {
  __typename?: 'SportPlay';
  _id?: Maybe<Scalars['ID']>;
  date?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
};

export type TeamPlay = {
  __typename?: 'TeamPlay';
  _id?: Maybe<Scalars['ID']>;
};

export type PlacesLived = {
  __typename?: 'PlacesLived';
  _id?: Maybe<Scalars['ID']>;
  current?: Maybe<Place>;
  home?: Maybe<Place>;
  others?: Maybe<Array<Maybe<Place>>>;
  past?: Maybe<Place>;
};

export type UserWork = {
  __typename?: 'UserWork';
  current?: Maybe<Work>;
  others?: Maybe<Array<Maybe<Work>>>;
  past?: Maybe<Work>;
};

export type Work = {
  __typename?: 'Work';
  _id?: Maybe<Scalars['ID']>;
  city?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  isCurrent?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  period?: Maybe<WorkPeroid>;
  position?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
};

export type GroupChat = {
  __typename?: 'GroupChat';
  _id?: Maybe<Scalars['ID']>;
  bg_image?: Maybe<Scalars['String']>;
  convo?: Maybe<Conversation>;
  creator?: Maybe<User>;
  desc?: Maybe<Scalars['String']>;
  file?: Maybe<File>;
  image?: Maybe<Scalars['String']>;
  members?: Maybe<Array<Maybe<User>>>;
  name?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<Scalars['String']>>>;
  team?: Maybe<Team>;
  teams?: Maybe<Array<Maybe<Team>>>;
  users?: Maybe<Array<Maybe<User>>>;
};

export type Message = {
  __typename?: 'Message';
  _chat_id?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['ID']>;
  attachments?: Maybe<Array<Maybe<File>>>;
  conversation_id?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  media?: Maybe<File>;
  read_status?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  system?: Maybe<Scalars['Boolean']>;
  text?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
  video?: Maybe<Scalars['String']>;
};

export type Application = {
  __typename?: 'Application';
  _id?: Maybe<Scalars['String']>;
  address?: Maybe<Scalars['String']>;
  comment?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  height?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  number?: Maybe<Scalars['String']>;
  position?: Maybe<Scalars['String']>;
  postal?: Maybe<Scalars['String']>;
  read?: Maybe<Scalars['String']>;
  squad?: Maybe<Squad>;
  state?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  suburb?: Maybe<Scalars['String']>;
  surname?: Maybe<Scalars['String']>;
  team?: Maybe<Team>;
  userFrom?: Maybe<User>;
  userTo?: Maybe<CommonUser>;
  weight?: Maybe<Scalars['String']>;
};

export type Document = {
  __typename?: 'Document';
  _id?: Maybe<Scalars['String']>;
  comments?: Maybe<Array<Maybe<Comment>>>;
  commentType?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  file?: Maybe<File>;
  likes?: Maybe<Array<Maybe<Like>>>;
  read?: Maybe<Scalars['String']>;
  shares?: Maybe<Array<Maybe<Share>>>;
  sport?: Maybe<Sport>;
  status?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<Scalars['String']>>>;
  teams?: Maybe<Array<Maybe<Team>>>;
  title?: Maybe<Scalars['String']>;
  user?: Maybe<CommonUser>;
};

export type Request = {
  data?: InputMaybe<Scalars['String']>;
  headers?: InputMaybe<Scalars['String']>;
  method?: InputMaybe<Scalars['String']>;
  url?: InputMaybe<Scalars['String']>;
};

export type UserRelationship = {
  __typename?: 'UserRelationship';
  _id?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  me?: Maybe<User>;
  receiver?: Maybe<Scalars['String']>;
  sender?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
  users?: Maybe<Array<Maybe<User>>>;
};

export type GamePost = {
  __typename?: 'GamePost';
  _id?: Maybe<Scalars['ID']>;
  comments?: Maybe<Array<Maybe<Comment>>>;
  content?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  game_id?: Maybe<Scalars['String']>;
  likes?: Maybe<Array<Maybe<Like>>>;
  min?: Maybe<Scalars['Int']>;
  moment?: Maybe<GameMoment>;
  player?: Maybe<Player>;
  reaction?: Maybe<Reaction>;
  status?: Maybe<Scalars['String']>;
  team_id?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
};

export type GameMoment = {
  __typename?: 'GameMoment';
  image?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
};

export type Reaction = {
  __typename?: 'Reaction';
  background?: Maybe<Scalars['Boolean']>;
  color?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  iconType?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
};

export type SettingItem = {
  __typename?: 'SettingItem';
  _id?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  default?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  user_id?: Maybe<Scalars['String']>;
};

export type MessageOuput = {
  __typename?: 'MessageOuput';
  hasOlder?: Maybe<Scalars['Boolean']>;
  messages?: Maybe<Array<Maybe<Message>>>;
};

export type PostUserType = {
  _id?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};

export type SearchResults = {
  __typename?: 'SearchResults';
  clubs?: Maybe<Array<Maybe<Club>>>;
  events?: Maybe<Array<Maybe<Event>>>;
  institutions?: Maybe<Array<Maybe<Institution>>>;
  people?: Maybe<Array<Maybe<User>>>;
  posts?: Maybe<Array<Maybe<Post>>>;
  teams?: Maybe<Array<Maybe<Team>>>;
  tournaments?: Maybe<Array<Maybe<Tournament>>>;
  training?: Maybe<Array<Maybe<SessionFile>>>;
};

export type SeasonGroupGame = {
  __typename?: 'SeasonGroupGame';
  _id?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  game?: Maybe<Game>;
  group?: Maybe<SeasonGroup>;
  leg?: Maybe<Scalars['Int']>;
  season?: Maybe<Season>;
  status?: Maybe<Scalars['String']>;
};

export type SeasonGroup = {
  __typename?: 'SeasonGroup';
  _id?: Maybe<Scalars['String']>;
  legs?: Maybe<Scalars['Int']>;
  noOfTeams?: Maybe<Scalars['Int']>;
  season?: Maybe<Season>;
  status?: Maybe<Scalars['String']>;
  teams?: Maybe<Array<Maybe<SeasonGroupTeam>>>;
};

export type SeasonGroupTeam = {
  __typename?: 'SeasonGroupTeam';
  _id?: Maybe<Scalars['String']>;
  group?: Maybe<SeasonGroup>;
  status?: Maybe<Scalars['String']>;
  team?: Maybe<Team>;
};

export type XmppClients = {
  __typename?: 'XmppClients';
  client?: Maybe<Scalars['String']>;
  server?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptOrDeclineFriend?: Maybe<Scalars['Boolean']>;
  addClub?: Maybe<Scalars['Boolean']>;
  addFriend?: Maybe<UserRelationship>;
  addGameAction?: Maybe<Game>;
  addInstitution?: Maybe<Scalars['Boolean']>;
  addOneShootout?: Maybe<Game>;
  addPlayer?: Maybe<Player>;
  addRole?: Maybe<Role>;
  addShootout?: Maybe<Game>;
  addSocial?: Maybe<Social>;
  addTeam?: Maybe<Scalars['Boolean']>;
  addTeamToSeasonGroup?: Maybe<SeasonGroupTeam>;
  addTournament?: Maybe<Scalars['Boolean']>;
  archiveSeason?: Maybe<Scalars['Boolean']>;
  createApplication?: Maybe<Application>;
  createDocument?: Maybe<Document>;
  createEvent?: Maybe<Event>;
  createGame?: Maybe<Game>;
  createGamePost?: Maybe<GamePost>;
  createLive?: Maybe<Live>;
  createSeason?: Maybe<Season>;
  createSeasonGames?: Maybe<Array<Maybe<SeasonGroupGame>>>;
  endGame?: Maybe<Game>;
  fanPage?: Maybe<LikePageResponse>;
  followPage?: Maybe<LikePageResponse>;
  generateDefaultSquad?: Maybe<Squad>;
  initConvo?: Maybe<Conversation>;
  likeComment?: Maybe<Like>;
  likePage?: Maybe<LikePageResponse>;
  likePost?: Maybe<Like>;
  likeReply?: Maybe<Like>;
  likeSessionFile?: Maybe<Like>;
  pauseGame?: Maybe<Game>;
  readApplication?: Maybe<Application>;
  readDocument?: Maybe<Document>;
  readNotice?: Maybe<Scalars['Boolean']>;
  recover?: Maybe<Scalars['Boolean']>;
  removeAct?: Maybe<Game>;
  removeRole?: Maybe<Scalars['Boolean']>;
  removeShootout?: Maybe<Game>;
  removeSocial?: Maybe<Scalars['Boolean']>;
  removeTeamFromSeasonGroup?: Maybe<Scalars['Boolean']>;
  saveGame?: Maybe<Game>;
  saveSetting?: Maybe<SettingItem>;
  sendMessage?: Maybe<Message>;
  setGamePlayers?: Maybe<Game>;
  setGameSquad?: Maybe<Game>;
  signUp?: Maybe<User>;
  startGame?: Maybe<Game>;
  startSeason?: Maybe<Season>;
  updateGameTime?: Maybe<Game>;
  updateProfileField?: Maybe<Scalars['Boolean']>;
  updateProfileFields?: Maybe<Scalars['Boolean']>;
  updateRole?: Maybe<Role>;
  updateSocial?: Maybe<Social>;
  updateTeam?: Maybe<Scalars['Boolean']>;
  viewPost?: Maybe<View>;
};


export type MutationAcceptOrDeclineFriendArgs = {
  _id?: InputMaybe<Scalars['String']>;
  accepted?: InputMaybe<Scalars['Boolean']>;
};


export type MutationAddClubArgs = {
  data?: InputMaybe<PageAddData>;
};


export type MutationAddFriendArgs = {
  from?: InputMaybe<Scalars['String']>;
  to?: InputMaybe<Scalars['String']>;
};


export type MutationAddGameActionArgs = {
  action?: InputMaybe<GameActionInput>;
  teamOne?: InputMaybe<Scalars['Boolean']>;
};


export type MutationAddInstitutionArgs = {
  data?: InputMaybe<PageAddData>;
};


export type MutationAddOneShootoutArgs = {
  game?: InputMaybe<Scalars['String']>;
  shootouts?: InputMaybe<GameShootoutActionInput>;
  teamOne?: InputMaybe<Scalars['Boolean']>;
};


export type MutationAddPlayerArgs = {
  player: PlayerAddInput;
  squad_id?: InputMaybe<Scalars['String']>;
  team_id: Scalars['String'];
};


export type MutationAddRoleArgs = {
  role?: InputMaybe<RoleInput>;
};


export type MutationAddShootoutArgs = {
  game?: InputMaybe<Scalars['String']>;
  shootouts?: InputMaybe<Array<InputMaybe<GameShootoutActionInput>>>;
  teamOne?: InputMaybe<Scalars['Boolean']>;
};


export type MutationAddSocialArgs = {
  social?: InputMaybe<SocialInput>;
  toId?: InputMaybe<Scalars['String']>;
  toType?: InputMaybe<Scalars['String']>;
};


export type MutationAddTeamArgs = {
  data?: InputMaybe<PageAddData>;
};


export type MutationAddTeamToSeasonGroupArgs = {
  _id?: InputMaybe<Scalars['String']>;
  teamID?: InputMaybe<Scalars['String']>;
};


export type MutationAddTournamentArgs = {
  data?: InputMaybe<PageAddData>;
};


export type MutationArchiveSeasonArgs = {
  _id?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['Boolean']>;
};


export type MutationCreateApplicationArgs = {
  app?: InputMaybe<ApplicationInput>;
};


export type MutationCreateDocumentArgs = {
  doc?: InputMaybe<CreateDocInput>;
};


export type MutationCreateEventArgs = {
  eventData?: InputMaybe<EventData>;
};


export type MutationCreateGameArgs = {
  game?: InputMaybe<GameInput>;
};


export type MutationCreateGamePostArgs = {
  input?: InputMaybe<GamePostInput>;
};


export type MutationCreateLiveArgs = {
  live?: InputMaybe<LiveInput>;
};


export type MutationCreateSeasonArgs = {
  data?: InputMaybe<SeasonInput>;
};


export type MutationCreateSeasonGamesArgs = {
  games?: InputMaybe<Array<InputMaybe<SeasonGameInput>>>;
  seasonId?: InputMaybe<Scalars['String']>;
};


export type MutationEndGameArgs = {
  _id?: InputMaybe<Scalars['String']>;
  time?: InputMaybe<Scalars['Int']>;
};


export type MutationFanPageArgs = {
  data?: InputMaybe<LikePageData>;
};


export type MutationFollowPageArgs = {
  data?: InputMaybe<LikePageData>;
};


export type MutationGenerateDefaultSquadArgs = {
  name?: InputMaybe<Scalars['String']>;
  team_id: Scalars['String'];
};


export type MutationInitConvoArgs = {
  data?: InputMaybe<ConvoInitData>;
};


export type MutationLikeCommentArgs = {
  likeData?: InputMaybe<LikeData>;
};


export type MutationLikePageArgs = {
  data?: InputMaybe<LikePageData>;
};


export type MutationLikePostArgs = {
  likeData?: InputMaybe<LikeData>;
};


export type MutationLikeReplyArgs = {
  likeData?: InputMaybe<LikeData>;
};


export type MutationLikeSessionFileArgs = {
  likeData?: InputMaybe<LikeData>;
};


export type MutationPauseGameArgs = {
  _id?: InputMaybe<Scalars['String']>;
  time?: InputMaybe<Scalars['Int']>;
};


export type MutationReadApplicationArgs = {
  _id?: InputMaybe<Scalars['String']>;
};


export type MutationReadDocumentArgs = {
  _id?: InputMaybe<Scalars['String']>;
};


export type MutationReadNoticeArgs = {
  _id?: InputMaybe<Scalars['String']>;
};


export type MutationRecoverArgs = {
  data?: InputMaybe<RecoveryInput>;
};


export type MutationRemoveActArgs = {
  _id?: InputMaybe<Scalars['String']>;
  game_id?: InputMaybe<Scalars['String']>;
};


export type MutationRemoveRoleArgs = {
  _id?: InputMaybe<Scalars['String']>;
};


export type MutationRemoveShootoutArgs = {
  _id?: InputMaybe<Scalars['String']>;
  game_id?: InputMaybe<Scalars['String']>;
};


export type MutationRemoveSocialArgs = {
  _id?: InputMaybe<Scalars['String']>;
};


export type MutationRemoveTeamFromSeasonGroupArgs = {
  _id?: InputMaybe<Scalars['String']>;
  group?: InputMaybe<Scalars['String']>;
  teamID?: InputMaybe<Scalars['String']>;
};


export type MutationSaveGameArgs = {
  _id?: InputMaybe<Scalars['String']>;
  data?: InputMaybe<GameEditinput>;
};


export type MutationSaveSettingArgs = {
  _id?: InputMaybe<Scalars['String']>;
  data?: InputMaybe<SettingInput>;
};


export type MutationSendMessageArgs = {
  message?: InputMaybe<MessageInput>;
};


export type MutationSetGamePlayersArgs = {
  _id?: InputMaybe<Scalars['String']>;
  teamOne?: InputMaybe<GamePlayerTeamInput>;
  teamTwo?: InputMaybe<GamePlayerTeamInput>;
};


export type MutationSetGameSquadArgs = {
  _id?: InputMaybe<Scalars['String']>;
  data?: InputMaybe<GameSquadInput>;
};


export type MutationSignUpArgs = {
  user?: InputMaybe<UserCreateInput>;
};


export type MutationStartGameArgs = {
  _id?: InputMaybe<Scalars['String']>;
  time?: InputMaybe<Scalars['Int']>;
};


export type MutationStartSeasonArgs = {
  _id?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateGameTimeArgs = {
  _id?: InputMaybe<Scalars['String']>;
  time?: InputMaybe<Scalars['Int']>;
};


export type MutationUpdateProfileFieldArgs = {
  _id?: InputMaybe<Scalars['String']>;
  field?: InputMaybe<Scalars['String']>;
  table?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateProfileFieldsArgs = {
  _id?: InputMaybe<Scalars['String']>;
  data?: InputMaybe<Array<InputMaybe<UpdateDataInput>>>;
  table?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateRoleArgs = {
  _id?: InputMaybe<Scalars['String']>;
  role?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateSocialArgs = {
  _id?: InputMaybe<Scalars['String']>;
  social?: InputMaybe<SocialInput>;
};


export type MutationUpdateTeamArgs = {
  _id?: InputMaybe<Scalars['String']>;
  data?: InputMaybe<PageAddData>;
};


export type MutationViewPostArgs = {
  likeData?: InputMaybe<LikeData>;
};

export type PageAddData = {
  captain?: InputMaybe<Scalars['String']>;
  contactMain?: InputMaybe<Scalars['String']>;
  contactOther?: InputMaybe<Scalars['String']>;
  createBy?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  gender?: InputMaybe<Scalars['String']>;
  level?: InputMaybe<Scalars['String']>;
  manager?: InputMaybe<Scalars['String']>;
  mode?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  secretary?: InputMaybe<Scalars['String']>;
  sport?: InputMaybe<Scalars['String']>;
  username?: InputMaybe<Scalars['String']>;
  website?: InputMaybe<Scalars['String']>;
};

export type GameActionInput = {
  game?: InputMaybe<Scalars['String']>;
  gameStage?: InputMaybe<Scalars['String']>;
  label?: InputMaybe<Scalars['String']>;
  player?: InputMaybe<Scalars['String']>;
  second_player?: InputMaybe<Scalars['String']>;
  squad?: InputMaybe<Scalars['String']>;
  team?: InputMaybe<Scalars['String']>;
  time?: InputMaybe<Scalars['Int']>;
  type?: InputMaybe<Scalars['String']>;
};

export type GameShootoutActionInput = {
  game?: InputMaybe<Scalars['String']>;
  isGoal?: InputMaybe<Scalars['Boolean']>;
  player?: InputMaybe<Scalars['String']>;
  squad?: InputMaybe<Scalars['String']>;
  team?: InputMaybe<Scalars['String']>;
};

export type PlayerAddInput = {
  dob?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  height?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  number?: InputMaybe<Scalars['String']>;
  origin?: InputMaybe<Scalars['String']>;
  position?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Scalars['String']>;
};

export type RoleInput = {
  role?: InputMaybe<Scalars['String']>;
  toId?: InputMaybe<Scalars['String']>;
  toType?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type SocialInput = {
  icon?: InputMaybe<Scalars['String']>;
  key?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
};

export type ApplicationInput = {
  address?: InputMaybe<Scalars['String']>;
  comment?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  height?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  number?: InputMaybe<Scalars['String']>;
  position?: InputMaybe<Scalars['String']>;
  postal?: InputMaybe<Scalars['String']>;
  squad?: InputMaybe<Scalars['String']>;
  state?: InputMaybe<Scalars['String']>;
  suburb?: InputMaybe<Scalars['String']>;
  surname?: InputMaybe<Scalars['String']>;
  team?: InputMaybe<Scalars['String']>;
  userFrom?: InputMaybe<Scalars['String']>;
  userToId?: InputMaybe<Scalars['String']>;
  userToType?: InputMaybe<Scalars['String']>;
  weight?: InputMaybe<Scalars['String']>;
};

export type CreateDocInput = {
  desc?: InputMaybe<Scalars['String']>;
  file?: InputMaybe<Scalars['String']>;
  sport?: InputMaybe<Scalars['String']>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  teams?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  title?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
  userType?: InputMaybe<Scalars['String']>;
};

export type EventData = {
  event?: InputMaybe<EventInput>;
  invites?: InputMaybe<Array<InputMaybe<EventInviteInput>>>;
  recurrences?: InputMaybe<EventRecurrenceInput>;
};

export type EventInput = {
  endFullTimestamp?: InputMaybe<Scalars['String']>;
  fullTimestamp?: InputMaybe<Scalars['String']>;
  isOneDay?: InputMaybe<Scalars['Boolean']>;
  managers?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  name?: InputMaybe<Scalars['String']>;
  place?: InputMaybe<Scalars['String']>;
  team?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  teams?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  type?: InputMaybe<Scalars['String']>;
};

export type EventInviteInput = {
  _id?: InputMaybe<Scalars['String']>;
};

export type EventRecurrenceInput = {
  days?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  time?: InputMaybe<Scalars['String']>;
};

export type GameInput = {
  admin?: InputMaybe<Scalars['String']>;
  currentQuarter?: InputMaybe<Scalars['Int']>;
  date?: InputMaybe<Scalars['String']>;
  half?: InputMaybe<Scalars['Int']>;
  homeTeam?: InputMaybe<Scalars['String']>;
  location?: InputMaybe<Scalars['String']>;
  owner?: InputMaybe<Scalars['String']>;
  players?: InputMaybe<GamePlayersInput>;
  quarter?: InputMaybe<Scalars['Int']>;
  ref?: InputMaybe<Scalars['String']>;
  ref_left?: InputMaybe<Scalars['String']>;
  ref_right?: InputMaybe<Scalars['String']>;
  sport?: InputMaybe<Scalars['String']>;
  squadOne?: InputMaybe<Scalars['String']>;
  squadTwo?: InputMaybe<Scalars['String']>;
  teamOne?: InputMaybe<Scalars['String']>;
  teamTwo?: InputMaybe<Scalars['String']>;
};

export type GamePlayersInput = {
  teamOne?: InputMaybe<GamePlayerTeamInput>;
  teamTwo?: InputMaybe<GamePlayerTeamInput>;
};

export type GamePlayerTeamInput = {
  lineup?: InputMaybe<Array<InputMaybe<GamePlayerInput>>>;
  subs?: InputMaybe<Array<InputMaybe<GamePlayerInput>>>;
};

export type GamePlayerInput = {
  _id?: InputMaybe<Scalars['String']>;
  isPlayer?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  number?: InputMaybe<Scalars['Int']>;
  position?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Scalars['String']>;
};

export type GamePostInput = {
  content?: InputMaybe<Scalars['String']>;
  error?: InputMaybe<Scalars['Boolean']>;
  game_id?: InputMaybe<Scalars['String']>;
  min?: InputMaybe<Scalars['Int']>;
  moment?: InputMaybe<GameMomentInput>;
  player?: InputMaybe<Scalars['String']>;
  reaction?: InputMaybe<ReactionInput>;
  team_id?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Scalars['String']>;
};

export type GameMomentInput = {
  image?: InputMaybe<Scalars['String']>;
  key?: InputMaybe<Scalars['String']>;
};

export type ReactionInput = {
  background?: InputMaybe<Scalars['Boolean']>;
  color?: InputMaybe<Scalars['String']>;
  icon?: InputMaybe<Scalars['String']>;
  iconType?: InputMaybe<Scalars['String']>;
  image?: InputMaybe<Scalars['String']>;
  key?: InputMaybe<Scalars['String']>;
};

export type LiveInput = {
  streamId?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Scalars['String']>;
};

export type Live = {
  __typename?: 'Live';
  comments?: Maybe<Array<Maybe<Comment>>>;
  date?: Maybe<Scalars['String']>;
  likes?: Maybe<Array<Maybe<Like>>>;
  shares?: Maybe<Array<Maybe<Share>>>;
  status?: Maybe<Scalars['String']>;
  streamId?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
  watchers?: Maybe<Array<Maybe<User>>>;
};

export type SeasonInput = {
  league?: InputMaybe<Scalars['String']>;
  legs?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
  noOfTeams?: InputMaybe<Scalars['Int']>;
  type?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Scalars['String']>;
};

export type SeasonGameInput = {
  group?: InputMaybe<Scalars['String']>;
  homeTeam?: InputMaybe<Scalars['String']>;
  leg?: InputMaybe<Scalars['Int']>;
  owner?: InputMaybe<Scalars['String']>;
  season?: InputMaybe<Scalars['String']>;
  sport?: InputMaybe<Scalars['String']>;
  teamOne?: InputMaybe<Scalars['String']>;
  teamTwo?: InputMaybe<Scalars['String']>;
};

export type LikePageData = {
  like?: InputMaybe<Scalars['String']>;
  reqOwner?: InputMaybe<LikePageDataUser>;
  user?: InputMaybe<LikePageDataUser>;
  userTo?: InputMaybe<LikePageDataUser>;
};

export type LikePageDataUser = {
  _id?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};

export type LikePageResponse = {
  __typename?: 'LikePageResponse';
  isLiked?: Maybe<Scalars['Boolean']>;
};

export type ConvoInitData = {
  userFrom?: InputMaybe<Scalars['String']>;
  userTo?: InputMaybe<Scalars['String']>;
};

export type LikeData = {
  _id: Scalars['String'];
  contentId: Scalars['String'];
  contentType: Scalars['String'];
  type: Scalars['String'];
};

export type RecoveryInput = {
  email?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
};

export type GameEditinput = {
  admin?: InputMaybe<Scalars['String']>;
  date?: InputMaybe<Scalars['String']>;
  half?: InputMaybe<Scalars['Int']>;
  location?: InputMaybe<Scalars['String']>;
};

export type SettingInput = {
  date?: InputMaybe<Scalars['String']>;
  default?: InputMaybe<Scalars['String']>;
  desc?: InputMaybe<Scalars['String']>;
  key?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
  user_id?: InputMaybe<Scalars['String']>;
};

export type MessageInput = {
  attachments?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  conversation_id?: InputMaybe<Scalars['String']>;
  text?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Scalars['String']>;
};

export type GameSquadInput = {
  squadOne?: InputMaybe<Scalars['String']>;
  squadTwo?: InputMaybe<Scalars['String']>;
};

export type UserCreateInput = {
  address?: InputMaybe<Scalars['String']>;
  bday?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  displayName?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  gender?: InputMaybe<Scalars['String']>;
  isParent?: InputMaybe<Scalars['Boolean']>;
  isSocialAuth?: InputMaybe<Scalars['Boolean']>;
  isUnderAge?: InputMaybe<Scalars['Boolean']>;
  mySport?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  name?: InputMaybe<Scalars['String']>;
  pass?: InputMaybe<Scalars['String']>;
  photoUrl?: InputMaybe<Scalars['String']>;
  postalCode?: InputMaybe<Scalars['String']>;
  provider?: InputMaybe<Scalars['String']>;
  sportsFollowed?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  state?: InputMaybe<Scalars['String']>;
  suburbs?: InputMaybe<Scalars['String']>;
  surname?: InputMaybe<Scalars['String']>;
  uid?: InputMaybe<Scalars['String']>;
};

export type UpdateDataInput = {
  key?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  game?: Maybe<Game>;
  gameLive?: Maybe<LiveVideoEvent>;
  newMessage?: Maybe<Message>;
  post?: Maybe<Post>;
  postUpdate?: Maybe<Post>;
  updateChats?: Maybe<Message>;
};


export type SubscriptionGameArgs = {
  _id?: InputMaybe<Scalars['String']>;
};


export type SubscriptionGameLiveArgs = {
  _id?: InputMaybe<Scalars['String']>;
};


export type SubscriptionNewMessageArgs = {
  _id?: InputMaybe<Scalars['String']>;
};


export type SubscriptionPostArgs = {
  _id?: InputMaybe<Scalars['String']>;
};


export type SubscriptionPostUpdateArgs = {
  _id?: InputMaybe<Scalars['String']>;
};


export type SubscriptionUpdateChatsArgs = {
  _id?: InputMaybe<Scalars['String']>;
};

export type LiveVideoEvent = {
  __typename?: 'LiveVideoEvent';
  _id?: Maybe<Scalars['ID']>;
  ended?: Maybe<Scalars['Boolean']>;
  started?: Maybe<Scalars['Boolean']>;
};

export enum CacheControlScope {
  Private = 'PRIVATE',
  Public = 'PUBLIC'
}

export enum CommonObjectType {
  Chat = 'CHAT',
  Club = 'CLUB',
  Event = 'EVENT',
  File = 'FILE',
  GamePost = 'GAME_POST',
  GmcPost = 'GMC_POST',
  Institution = 'INSTITUTION',
  Post = 'POST',
  Session = 'SESSION',
  Sessionfile = 'SESSIONFILE',
  Team = 'TEAM',
  Tourn = 'TOURN'
}

export enum ConvoType {
  Event = 'EVENT',
  Parents = 'PARENTS',
  Timeline = 'TIMELINE'
}

export type EmailMessage = {
  __typename?: 'EmailMessage';
  _id?: Maybe<Scalars['ID']>;
  attachments?: Maybe<Array<Maybe<File>>>;
  body?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  media?: Maybe<File>;
  status?: Maybe<Scalars['String']>;
  subject?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  user?: Maybe<Scalars['String']>;
  users?: Maybe<Array<Maybe<User>>>;
};

export enum MessageStatus {
  Delivered = 'DELIVERED',
  Read = 'READ',
  Sent = 'SENT'
}

export enum MessageType {
  Chat = 'CHAT',
  Email = 'EMAIL'
}

export type RegistrationUserInput = {
  address?: InputMaybe<Scalars['String']>;
  birth_month?: InputMaybe<Scalars['String']>;
  birth_year?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  dob?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  first_name?: InputMaybe<Scalars['String']>;
  height?: InputMaybe<Scalars['String']>;
  last_name?: InputMaybe<Scalars['String']>;
  mySport?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  parent?: InputMaybe<Scalars['String']>;
  phone?: InputMaybe<Scalars['String']>;
  postal?: InputMaybe<Scalars['String']>;
  sportsFollowed?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  state?: InputMaybe<Scalars['String']>;
  suburb?: InputMaybe<Scalars['String']>;
  weight?: InputMaybe<Scalars['String']>;
};

export type SeasonGroupInput = {
  _id?: InputMaybe<Scalars['String']>;
  season?: InputMaybe<Scalars['String']>;
};

export enum Status {
  Active = 'ACTIVE',
  Deactive = 'DEACTIVE'
}

export enum UserType {
  C = 'C',
  E = 'E',
  F = 'F',
  G = 'G',
  I = 'I',
  L = 'L',
  Q = 'Q',
  T = 'T'
}

export type RelationShipFragFragment = { __typename?: 'UserRelationship', _id?: string | null, status?: string | null, sender?: string | null, receiver?: string | null, users?: Array<{ __typename?: 'User', _id?: string | null, name?: string | null, email?: string | null, image?: string | null } | null> | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, email?: string | null, image?: string | null } | null, me?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, email?: string | null } | null };

export type SeasonFragmentFragment = { __typename?: 'Season', _id?: string | null, date?: string | null, legs?: number | null, name?: string | null, noOfTeams?: number | null, status?: string | null, type?: string | null, isPast?: boolean | null, started?: boolean | null, hasGames?: boolean | null, finished?: boolean | null, league?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, sport?: { __typename?: 'Sport', _id?: string | null, name?: string | null } | null } | null, teams?: Array<{ __typename?: 'Team', _id?: string | null } | null> | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null } | null };

export type SeasonGroupFragmentFragment = { __typename?: 'SeasonGroup', _id?: string | null, legs?: number | null, noOfTeams?: number | null, teams?: Array<{ __typename?: 'SeasonGroupTeam', _id?: string | null, team?: { __typename?: 'Team', name?: string | null, image?: string | null, _id?: string | null } | null } | null> | null };

export type SeasonGroupGameFragFragment = { __typename?: 'SeasonGroupGame', _id?: string | null, status?: string | null, game?: { __typename?: 'Game', _id?: string | null } | null };

export type AcceptOrDeclineFriendMutationVariables = Exact<{
  _id?: InputMaybe<Scalars['String']>;
  accepted?: InputMaybe<Scalars['Boolean']>;
}>;


export type AcceptOrDeclineFriendMutation = { __typename?: 'Mutation', acceptOrDeclineFriend?: boolean | null };

export type AddFriendMutationVariables = Exact<{
  from?: InputMaybe<Scalars['String']>;
  to?: InputMaybe<Scalars['String']>;
}>;


export type AddFriendMutation = { __typename?: 'Mutation', addFriend?: { __typename?: 'UserRelationship', _id?: string | null, status?: string | null, sender?: string | null, receiver?: string | null, users?: Array<{ __typename?: 'User', _id?: string | null, name?: string | null, email?: string | null, image?: string | null } | null> | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, email?: string | null, image?: string | null } | null, me?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, email?: string | null } | null } | null };

export type AddTeamToSeasonGroupMutationVariables = Exact<{
  teamID?: InputMaybe<Scalars['String']>;
  _id?: InputMaybe<Scalars['String']>;
}>;


export type AddTeamToSeasonGroupMutation = { __typename?: 'Mutation', addTeamToSeasonGroup?: { __typename?: 'SeasonGroupTeam', _id?: string | null, team?: { __typename?: 'Team', name?: string | null, image?: string | null, _id?: string | null } | null } | null };

export type ArchiveSeasonMutationVariables = Exact<{
  _id?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['Boolean']>;
}>;


export type ArchiveSeasonMutation = { __typename?: 'Mutation', archiveSeason?: boolean | null };

export type CreateSeasonMutationVariables = Exact<{
  data?: InputMaybe<SeasonInput>;
}>;


export type CreateSeasonMutation = { __typename?: 'Mutation', createSeason?: { __typename?: 'Season', _id?: string | null, date?: string | null, legs?: number | null, name?: string | null, noOfTeams?: number | null, status?: string | null, type?: string | null, isPast?: boolean | null, started?: boolean | null, hasGames?: boolean | null, finished?: boolean | null, league?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, sport?: { __typename?: 'Sport', _id?: string | null, name?: string | null } | null } | null, teams?: Array<{ __typename?: 'Team', _id?: string | null } | null> | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null } | null } | null };

export type CreateSeasonGamesMutationVariables = Exact<{
  games?: InputMaybe<Array<InputMaybe<SeasonGameInput>> | InputMaybe<SeasonGameInput>>;
  seasonId?: InputMaybe<Scalars['String']>;
}>;


export type CreateSeasonGamesMutation = { __typename?: 'Mutation', createSeasonGames?: Array<{ __typename?: 'SeasonGroupGame', _id?: string | null, status?: string | null, game?: { __typename?: 'Game', _id?: string | null } | null } | null> | null };

export type ReadNoticeMutationVariables = Exact<{
  _id?: InputMaybe<Scalars['String']>;
}>;


export type ReadNoticeMutation = { __typename?: 'Mutation', readNotice?: boolean | null };

export type RecoverMutationVariables = Exact<{
  data?: InputMaybe<RecoveryInput>;
}>;


export type RecoverMutation = { __typename?: 'Mutation', recover?: boolean | null };

export type RemoveTeamFromSeasonGroupMutationVariables = Exact<{
  teamID?: InputMaybe<Scalars['String']>;
  _id?: InputMaybe<Scalars['String']>;
  group?: InputMaybe<Scalars['String']>;
}>;


export type RemoveTeamFromSeasonGroupMutation = { __typename?: 'Mutation', removeTeamFromSeasonGroup?: boolean | null };

export type SaveSettingMutationVariables = Exact<{
  _id?: InputMaybe<Scalars['String']>;
  data?: InputMaybe<SettingInput>;
}>;


export type SaveSettingMutation = { __typename?: 'Mutation', saveSetting?: { __typename: 'SettingItem', _id?: string | null, status?: string | null, date?: string | null, type?: string | null, key?: string | null, desc?: string | null, default?: string | null, user_id?: string | null } | null };

export type SignUpMutationVariables = Exact<{
  user?: InputMaybe<UserCreateInput>;
}>;


export type SignUpMutation = { __typename?: 'Mutation', signUp?: { __typename?: 'User', _id?: string | null, name?: string | null, username?: string | null, image?: string | null, id?: string | null, first_name?: string | null, last_name?: string | null, phone?: string | null, email?: string | null } | null };

export type AuthQueryVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type AuthQuery = { __typename?: 'Query', auth?: { __typename?: 'User', _id?: string | null, name?: string | null, username?: string | null, image?: string | null, id?: string | null, first_name?: string | null, last_name?: string | null, phone?: string | null, email?: string | null } | null };

export type FriendsQueryVariables = Exact<{
  _id?: InputMaybe<Scalars['String']>;
}>;


export type FriendsQuery = { __typename?: 'Query', friends?: Array<{ __typename?: 'UserRelationship', _id?: string | null, status?: string | null, sender?: string | null, receiver?: string | null, users?: Array<{ __typename?: 'User', _id?: string | null, name?: string | null, email?: string | null, image?: string | null } | null> | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, email?: string | null, image?: string | null } | null, me?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, email?: string | null } | null } | null> | null };

export type GetSettingQueryVariables = Exact<{
  _id?: InputMaybe<Scalars['String']>;
  key?: InputMaybe<Scalars['String']>;
}>;


export type GetSettingQuery = { __typename?: 'Query', getSetting?: { __typename: 'SettingItem', _id?: string | null, status?: string | null, date?: string | null, type?: string | null, key?: string | null, desc?: string | null, default?: string | null, user_id?: string | null } | null };

export type GetSettingsQueryVariables = Exact<{
  _id?: InputMaybe<Scalars['String']>;
}>;


export type GetSettingsQuery = { __typename?: 'Query', getSettings?: Array<{ __typename: 'SettingItem', _id?: string | null, status?: string | null, date?: string | null, type?: string | null, key?: string | null, desc?: string | null, default?: string | null, user_id?: string | null } | null> | null };

export type NoticeQueryVariables = Exact<{
  _id?: InputMaybe<Scalars['String']>;
}>;


export type NoticeQuery = { __typename?: 'Query', notices?: Array<{ __typename?: 'Notice', _id?: string | null, date?: string | null, context?: { __typename: 'NoticeContext', body?: string | null, title?: string | null, date?: string | null, status?: string | null } | null, actionData?: { __typename?: 'NoticeActionData', context?: string | null, contextId?: string | null, isBlock?: boolean | null, contextTarget?: { __typename?: 'CommonObject', type?: string | null, _id?: string | null } | null } | null } | null> | null };

export type NoticesQueryVariables = Exact<{
  _id?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
}>;


export type NoticesQuery = { __typename?: 'Query', notices?: Array<{ __typename?: 'Notice', _id?: string | null, date?: string | null, context?: { __typename: 'NoticeContext', body?: string | null, title?: string | null, date?: string | null, status?: string | null } | null, actionData?: { __typename?: 'NoticeActionData', context?: string | null, contextId?: string | null, isBlock?: boolean | null, contextTarget?: { __typename?: 'CommonObject', type?: string | null, _id?: string | null } | null } | null } | null> | null };

export type PendingQueryVariables = Exact<{
  _id?: InputMaybe<Scalars['String']>;
}>;


export type PendingQuery = { __typename?: 'Query', pending?: Array<{ __typename?: 'UserRelationship', _id?: string | null, status?: string | null, sender?: string | null, receiver?: string | null, users?: Array<{ __typename?: 'User', _id?: string | null, name?: string | null, email?: string | null, image?: string | null } | null> | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, email?: string | null, image?: string | null } | null, me?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, email?: string | null } | null } | null> | null };

export type AsyncPostUserFragmentFragment = { __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null };

export type AsyncPostFragFragment = { __typename?: 'Post', _id?: string | null, content?: string | null, rawContent?: string | null, type?: string | null, video_id?: string | null, is_live?: boolean | null, isEvent?: boolean | null, isGMC?: boolean | null, minute?: number | null, skills?: Array<string | null> | null, hashtags?: Array<string | null> | null, isGAME?: boolean | null, hasLink?: boolean | null, isLiked?: boolean | null, isTagged?: boolean | null, timeAgo?: string | null, status?: string | null, date?: string | null, pages?: Array<string | null> | null, commentType?: string | null, shareType?: string | null, isShared?: boolean | null, user?: { __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null, owner?: { __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null, userTo?: { __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null, sport?: { __typename?: 'Sport', _id?: string | null, image?: string | null, name?: string | null } | null, video?: { __typename?: 'Video', name?: string | null, src?: string | null } | null, links?: Array<{ __typename?: 'Link', _id?: string | null, title?: string | null, description?: string | null, url?: string | null, images?: Array<string | null> | null, status?: string | null, date?: string | null, user?: { __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null } | null> | null, media?: Array<{ __typename?: 'File', _id?: string | null, status?: string | null, date?: string | null, url?: string | null, name?: string | null, type?: string | null, object_type?: string | null, height?: number | null, width?: number | null, orientation?: number | null, user?: { __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null, userTo?: { __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null, tags?: Array<{ __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null> | null } | null> | null, file?: { __typename?: 'File', _id?: string | null, status?: string | null, date?: string | null, url?: string | null, name?: string | null, type?: string | null, object_type?: string | null, height?: number | null, width?: number | null, orientation?: number | null, user?: { __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null, userTo?: { __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null, tags?: Array<{ __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null> | null } | null, likes?: Array<{ __typename?: 'Like', _id?: string | null, type?: string | null, user?: { __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null } | null> | null, views?: Array<{ __typename?: 'View', _id?: string | null, type?: string | null, user?: { __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null } | null> | null, shares?: Array<{ __typename?: 'Share', _id?: string | null, type?: string | null, user?: { __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null } | null> | null, comments?: Array<{ __typename?: 'Comment', _id?: string | null, content?: string | null, rawContent?: string | null, tag?: string | null, user?: { __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null, owner?: { __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null, userTo?: { __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null, contentUsers?: Array<{ __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null> | null, replies?: Array<{ __typename?: 'Reply', _id?: string | null, content?: string | null, rawContent?: string | null, user?: { __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null, owner?: { __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null, userTo?: { __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null, contentUsers?: Array<{ __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null> | null, media?: { __typename?: 'File', _id?: string | null, status?: string | null, date?: string | null, url?: string | null, name?: string | null } | null } | null> | null, team?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null } | null, media?: { __typename?: 'File', _id?: string | null, status?: string | null, date?: string | null, url?: string | null, name?: string | null } | null } | null> | null };

export type Events_FragFragment = { __typename?: 'Event', _id?: string | null, status?: string | null, created_at?: string | null, type?: string | null, color?: string | null, event_type?: string | null, fullTimestamp?: string | null, endFullTimestamp?: string | null, name?: string | null, desc?: string | null, isOneDay?: boolean | null, likes?: Array<{ __typename?: 'Like', _id?: string | null } | null> | null, user?: { __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null, managers?: Array<{ __typename?: 'User', _id?: string | null, type?: string | null, name?: string | null, image?: string | null } | null> | null, team?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, sport?: { __typename?: 'Sport', _id?: string | null, image?: string | null, name?: string | null } | null } | null, teams?: Array<{ __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, sport?: { __typename?: 'Sport', _id?: string | null, image?: string | null, name?: string | null } | null } | null> | null, invites?: Array<{ __typename?: 'EventInvite', _id?: string | null, status?: string | null, date?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null, place?: { __typename?: 'Place', _id?: string | null, name?: string | null, coord?: { __typename?: 'Coord', lat?: string | null, lng?: string | null } | null } | null, coord?: { __typename?: 'CoordExt', lon?: string | null, lat?: string | null } | null };

export type SearchQueryVariables = Exact<{
  query?: InputMaybe<Scalars['String']>;
}>;


export type SearchQuery = { __typename?: 'Query', search?: { __typename?: 'SearchResults', people?: Array<{ __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, email?: string | null, followers?: Array<{ __typename?: 'Follower', _id?: string | null } | null> | null } | null> | null, events?: Array<{ __typename?: 'Event', _id?: string | null, status?: string | null, created_at?: string | null, type?: string | null, color?: string | null, event_type?: string | null, fullTimestamp?: string | null, endFullTimestamp?: string | null, name?: string | null, desc?: string | null, isOneDay?: boolean | null, likes?: Array<{ __typename?: 'Like', _id?: string | null } | null> | null, user?: { __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null, managers?: Array<{ __typename?: 'User', _id?: string | null, type?: string | null, name?: string | null, image?: string | null } | null> | null, team?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, sport?: { __typename?: 'Sport', _id?: string | null, image?: string | null, name?: string | null } | null } | null, teams?: Array<{ __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, sport?: { __typename?: 'Sport', _id?: string | null, image?: string | null, name?: string | null } | null } | null> | null, invites?: Array<{ __typename?: 'EventInvite', _id?: string | null, status?: string | null, date?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null, place?: { __typename?: 'Place', _id?: string | null, name?: string | null, coord?: { __typename?: 'Coord', lat?: string | null, lng?: string | null } | null } | null, coord?: { __typename?: 'CoordExt', lon?: string | null, lat?: string | null } | null } | null> | null, training?: Array<{ __typename?: 'SessionFile', _id?: string | null, title?: string | null, description?: string | null, date?: string | null, type?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null } | null, file?: { __typename?: 'File', _id?: string | null, url?: string | null, name?: string | null, type?: string | null, user?: { __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null, video?: { __typename?: 'Video', _id?: string | null, src?: string | null } | null } | null } | null> | null, posts?: Array<{ __typename?: 'Post', _id?: string | null, content?: string | null, rawContent?: string | null, type?: string | null, video_id?: string | null, is_live?: boolean | null, isEvent?: boolean | null, isGMC?: boolean | null, minute?: number | null, skills?: Array<string | null> | null, hashtags?: Array<string | null> | null, isGAME?: boolean | null, hasLink?: boolean | null, isLiked?: boolean | null, isTagged?: boolean | null, timeAgo?: string | null, status?: string | null, date?: string | null, pages?: Array<string | null> | null, commentType?: string | null, shareType?: string | null, isShared?: boolean | null, sharedObject?: { __typename?: 'CommonObject', _id?: string | null, type?: string | null, POST?: { __typename?: 'Post', _id?: string | null, content?: string | null, rawContent?: string | null, type?: string | null, video_id?: string | null, is_live?: boolean | null, isEvent?: boolean | null, isGMC?: boolean | null, minute?: number | null, skills?: Array<string | null> | null, hashtags?: Array<string | null> | null, isGAME?: boolean | null, hasLink?: boolean | null, isLiked?: boolean | null, isTagged?: boolean | null, timeAgo?: string | null, status?: string | null, date?: string | null, pages?: Array<string | null> | null, commentType?: string | null, shareType?: string | null, isShared?: boolean | null, user?: { __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null, owner?: { __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null, userTo?: { __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null, sport?: { __typename?: 'Sport', _id?: string | null, image?: string | null, name?: string | null } | null, video?: { __typename?: 'Video', name?: string | null, src?: string | null } | null, links?: Array<{ __typename?: 'Link', _id?: string | null, title?: string | null, description?: string | null, url?: string | null, images?: Array<string | null> | null, status?: string | null, date?: string | null, user?: { __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null } | null> | null, media?: Array<{ __typename?: 'File', _id?: string | null, status?: string | null, date?: string | null, url?: string | null, name?: string | null, type?: string | null, object_type?: string | null, height?: number | null, width?: number | null, orientation?: number | null, user?: { __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null, userTo?: { __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null, tags?: Array<{ __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null> | null } | null> | null, file?: { __typename?: 'File', _id?: string | null, status?: string | null, date?: string | null, url?: string | null, name?: string | null, type?: string | null, object_type?: string | null, height?: number | null, width?: number | null, orientation?: number | null, user?: { __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null, userTo?: { __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null, tags?: Array<{ __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null> | null } | null, likes?: Array<{ __typename?: 'Like', _id?: string | null, type?: string | null, user?: { __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null } | null> | null, views?: Array<{ __typename?: 'View', _id?: string | null, type?: string | null, user?: { __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null } | null> | null, shares?: Array<{ __typename?: 'Share', _id?: string | null, type?: string | null, user?: { __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null } | null> | null, comments?: Array<{ __typename?: 'Comment', _id?: string | null, content?: string | null, rawContent?: string | null, tag?: string | null, user?: { __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null, owner?: { __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null, userTo?: { __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null, contentUsers?: Array<{ __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null> | null, replies?: Array<{ __typename?: 'Reply', _id?: string | null, content?: string | null, rawContent?: string | null, user?: { __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null, owner?: { __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null, userTo?: { __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null, contentUsers?: Array<{ __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null> | null, media?: { __typename?: 'File', _id?: string | null, status?: string | null, date?: string | null, url?: string | null, name?: string | null } | null } | null> | null, team?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null } | null, media?: { __typename?: 'File', _id?: string | null, status?: string | null, date?: string | null, url?: string | null, name?: string | null } | null } | null> | null } | null, SESSIONFILE?: { __typename?: 'SessionFile', _id?: string | null, status?: string | null, date?: string | null, commentCount?: number | null, commentType?: string | null, description?: string | null, link?: string | null, isFavoured?: boolean | null, isOwner?: boolean | null } | null } | null, user?: { __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null, owner?: { __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null, userTo?: { __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null, sport?: { __typename?: 'Sport', _id?: string | null, image?: string | null, name?: string | null } | null, video?: { __typename?: 'Video', name?: string | null, src?: string | null } | null, links?: Array<{ __typename?: 'Link', _id?: string | null, title?: string | null, description?: string | null, url?: string | null, images?: Array<string | null> | null, status?: string | null, date?: string | null, user?: { __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null } | null> | null, media?: Array<{ __typename?: 'File', _id?: string | null, status?: string | null, date?: string | null, url?: string | null, name?: string | null, type?: string | null, object_type?: string | null, height?: number | null, width?: number | null, orientation?: number | null, user?: { __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null, userTo?: { __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null, tags?: Array<{ __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null> | null } | null> | null, file?: { __typename?: 'File', _id?: string | null, status?: string | null, date?: string | null, url?: string | null, name?: string | null, type?: string | null, object_type?: string | null, height?: number | null, width?: number | null, orientation?: number | null, user?: { __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null, userTo?: { __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null, tags?: Array<{ __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null> | null } | null, likes?: Array<{ __typename?: 'Like', _id?: string | null, type?: string | null, user?: { __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null } | null> | null, views?: Array<{ __typename?: 'View', _id?: string | null, type?: string | null, user?: { __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null } | null> | null, shares?: Array<{ __typename?: 'Share', _id?: string | null, type?: string | null, user?: { __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null } | null> | null, comments?: Array<{ __typename?: 'Comment', _id?: string | null, content?: string | null, rawContent?: string | null, tag?: string | null, user?: { __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null, owner?: { __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null, userTo?: { __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null, contentUsers?: Array<{ __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null> | null, replies?: Array<{ __typename?: 'Reply', _id?: string | null, content?: string | null, rawContent?: string | null, user?: { __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null, owner?: { __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null, userTo?: { __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null, contentUsers?: Array<{ __typename?: 'CommonUser', _id?: string | null, type?: string | null, F?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, C?: { __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, T?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, I?: { __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, E?: { __typename?: 'Event', _id?: string | null, name?: string | null, type?: string | null } | null, G?: { __typename?: 'Game', _id?: string | null } | null, L?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, type?: string | null, roles?: Array<{ __typename?: 'Role', _id?: string | null, role?: string | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null, type?: string | null } | null } | null> | null } | null, Q?: { __typename?: 'Group', _id?: string | null, type?: string | null } | null } | null> | null, media?: { __typename?: 'File', _id?: string | null, status?: string | null, date?: string | null, url?: string | null, name?: string | null } | null } | null> | null, team?: { __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null } | null, media?: { __typename?: 'File', _id?: string | null, status?: string | null, date?: string | null, url?: string | null, name?: string | null } | null } | null> | null } | null> | null, teams?: Array<{ __typename?: 'Team', _id?: string | null, name?: string | null, image?: string | null, email?: string | null, followers?: Array<{ __typename?: 'Follower', _id?: string | null } | null> | null } | null> | null, clubs?: Array<{ __typename?: 'Club', _id?: string | null, name?: string | null, image?: string | null, email?: string | null, followers?: Array<{ __typename?: 'Follower', _id?: string | null } | null> | null } | null> | null, institutions?: Array<{ __typename?: 'Institution', _id?: string | null, name?: string | null, image?: string | null, email?: string | null, followers?: Array<{ __typename?: 'Follower', _id?: string | null } | null> | null } | null> | null, tournaments?: Array<{ __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, email?: string | null, followers?: Array<{ __typename?: 'Follower', _id?: string | null } | null> | null } | null> | null } | null };

export type SeasonQueryVariables = Exact<{
  _id?: InputMaybe<Scalars['String']>;
}>;


export type SeasonQuery = { __typename?: 'Query', season?: { __typename?: 'Season', _id?: string | null, date?: string | null, legs?: number | null, name?: string | null, noOfTeams?: number | null, status?: string | null, type?: string | null, isPast?: boolean | null, started?: boolean | null, hasGames?: boolean | null, finished?: boolean | null, league?: { __typename?: 'Tournament', _id?: string | null, name?: string | null, image?: string | null, sport?: { __typename?: 'Sport', _id?: string | null, name?: string | null } | null } | null, teams?: Array<{ __typename?: 'Team', _id?: string | null } | null> | null, user?: { __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null } | null } | null };

export type SeasonGamesQueryVariables = Exact<{
  _id?: InputMaybe<Scalars['String']>;
}>;


export type SeasonGamesQuery = { __typename?: 'Query', seasonGames?: Array<{ __typename?: 'SeasonGroupGame', _id?: string | null, game?: { __typename?: 'Game', _id?: string | null } | null } | null> | null };

export type SeasonGroupsQueryVariables = Exact<{
  _id?: InputMaybe<Scalars['String']>;
}>;


export type SeasonGroupsQuery = { __typename?: 'Query', seasonGroups?: Array<{ __typename?: 'SeasonGroup', _id?: string | null, legs?: number | null, noOfTeams?: number | null, teams?: Array<{ __typename?: 'SeasonGroupTeam', _id?: string | null, team?: { __typename?: 'Team', name?: string | null, image?: string | null, _id?: string | null } | null } | null> | null } | null> | null };

export type UsersQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersQuery = { __typename?: 'Query', users?: Array<{ __typename?: 'User', _id?: string | null, name?: string | null, image?: string | null } | null> | null };

export const RelationShipFragFragmentDoc = gql`
    fragment RelationShipFrag on UserRelationship {
  _id
  status
  sender
  receiver
  users {
    _id
    name
    email
    image
  }
  user {
    _id
    name
    email
    image
  }
  me {
    _id
    name
    image
    email
  }
}
    `;
export const SeasonFragmentFragmentDoc = gql`
    fragment SeasonFragment on Season {
  _id
  date
  league {
    _id
    name
    image
    sport {
      _id
      name
    }
  }
  legs
  name
  noOfTeams
  status
  teams {
    _id
  }
  type
  user {
    _id
    name
    image
  }
  isPast
  started
  hasGames
  finished
}
    `;
export const SeasonGroupFragmentFragmentDoc = gql`
    fragment SeasonGroupFragment on SeasonGroup {
  _id
  legs
  noOfTeams
  teams {
    _id
    team {
      name
      image
      _id
    }
  }
}
    `;
export const SeasonGroupGameFragFragmentDoc = gql`
    fragment SeasonGroupGameFrag on SeasonGroupGame {
  _id
  status
  game {
    _id
  }
}
    `;
export const AsyncPostUserFragmentFragmentDoc = gql`
    fragment AsyncPostUserFragment on CommonUser {
  _id
  type
  F {
    _id
    name
    image
    type
    roles {
      _id
      role
      user {
        _id
        name
        image
        type
      }
    }
  }
  C {
    _id
    name
    image
    type
    roles {
      _id
      role
      user {
        _id
        name
        image
        type
      }
    }
  }
  T {
    _id
    name
    image
    type
    roles {
      _id
      role
      user {
        _id
        name
        image
        type
      }
    }
  }
  I {
    _id
    name
    image
    type
    roles {
      _id
      role
      user {
        _id
        name
        image
        type
      }
    }
  }
  E {
    _id
    name
    type
  }
  G {
    _id
  }
  L {
    _id
    name
    image
    type
    roles {
      _id
      role
      user {
        _id
        name
        image
        type
      }
    }
  }
  Q {
    _id
    type
  }
}
    `;
export const AsyncPostFragFragmentDoc = gql`
    fragment AsyncPostFrag on Post {
  _id
  content
  rawContent
  user {
    ...AsyncPostUserFragment
  }
  owner {
    ...AsyncPostUserFragment
  }
  userTo {
    ...AsyncPostUserFragment
  }
  type
  sport {
    _id
    image
    name
  }
  video {
    name
    src
  }
  video_id
  is_live
  isEvent
  isGMC
  minute
  skills
  hashtags
  isGAME
  hasLink
  links {
    _id
    title
    description
    url
    images
    status
    date
    user {
      ...AsyncPostUserFragment
    }
  }
  isLiked
  isTagged
  media {
    _id
    status
    date
    url
    name
    type
    object_type
    height
    width
    orientation
    user {
      ...AsyncPostUserFragment
    }
    userTo {
      ...AsyncPostUserFragment
    }
    tags {
      ...AsyncPostUserFragment
    }
  }
  timeAgo
  status
  date
  pages
  commentType
  file {
    _id
    status
    date
    url
    name
    type
    object_type
    height
    width
    orientation
    user {
      ...AsyncPostUserFragment
    }
    userTo {
      ...AsyncPostUserFragment
    }
    tags {
      ...AsyncPostUserFragment
    }
  }
  likes {
    _id
    type
    user {
      ...AsyncPostUserFragment
    }
  }
  views {
    _id
    type
    user {
      ...AsyncPostUserFragment
    }
  }
  shares {
    _id
    type
    user {
      ...AsyncPostUserFragment
    }
  }
  comments {
    _id
    user {
      ...AsyncPostUserFragment
    }
    content
    rawContent
    owner {
      ...AsyncPostUserFragment
    }
    userTo {
      ...AsyncPostUserFragment
    }
    contentUsers {
      ...AsyncPostUserFragment
    }
    replies {
      _id
      content
      rawContent
      user {
        ...AsyncPostUserFragment
      }
      owner {
        ...AsyncPostUserFragment
      }
      userTo {
        ...AsyncPostUserFragment
      }
      contentUsers {
        ...AsyncPostUserFragment
      }
      media {
        _id
        status
        date
        url
        name
      }
    }
    tag
    team {
      _id
      name
      image
    }
    media {
      _id
      status
      date
      url
      name
    }
  }
  shareType
  isShared
}
    ${AsyncPostUserFragmentFragmentDoc}`;
export const Events_FragFragmentDoc = gql`
    fragment EVENTS_FRAG on Event {
  _id
  status
  created_at
  type
  likes {
    _id
  }
  user {
    ...AsyncPostUserFragment
  }
  managers {
    _id
    type
    name
    image
  }
  color
  event_type
  fullTimestamp
  endFullTimestamp
  team {
    _id
    name
    image
    type
    sport {
      _id
      image
      name
    }
  }
  teams {
    _id
    name
    image
    type
    sport {
      _id
      image
      name
    }
  }
  name
  desc
  isOneDay
  invites {
    _id
    status
    date
    user {
      _id
      name
      image
      type
    }
  }
  place {
    _id
    name
    coord {
      lat
      lng
    }
  }
  coord {
    lon
    lat
  }
}
    ${AsyncPostUserFragmentFragmentDoc}`;
export const AcceptOrDeclineFriendDocument = gql`
    mutation acceptOrDeclineFriend($_id: String, $accepted: Boolean) {
  acceptOrDeclineFriend(_id: $_id, accepted: $accepted)
}
    `;
export type AcceptOrDeclineFriendMutationFn = Apollo.MutationFunction<AcceptOrDeclineFriendMutation, AcceptOrDeclineFriendMutationVariables>;

/**
 * __useAcceptOrDeclineFriendMutation__
 *
 * To run a mutation, you first call `useAcceptOrDeclineFriendMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcceptOrDeclineFriendMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acceptOrDeclineFriendMutation, { data, loading, error }] = useAcceptOrDeclineFriendMutation({
 *   variables: {
 *      _id: // value for '_id'
 *      accepted: // value for 'accepted'
 *   },
 * });
 */
export function useAcceptOrDeclineFriendMutation(baseOptions?: Apollo.MutationHookOptions<AcceptOrDeclineFriendMutation, AcceptOrDeclineFriendMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AcceptOrDeclineFriendMutation, AcceptOrDeclineFriendMutationVariables>(AcceptOrDeclineFriendDocument, options);
      }
export type AcceptOrDeclineFriendMutationHookResult = ReturnType<typeof useAcceptOrDeclineFriendMutation>;
export type AcceptOrDeclineFriendMutationResult = Apollo.MutationResult<AcceptOrDeclineFriendMutation>;
export type AcceptOrDeclineFriendMutationOptions = Apollo.BaseMutationOptions<AcceptOrDeclineFriendMutation, AcceptOrDeclineFriendMutationVariables>;
export const AddFriendDocument = gql`
    mutation addFriend($from: String, $to: String) {
  addFriend(from: $from, to: $to) {
    ...RelationShipFrag
  }
}
    ${RelationShipFragFragmentDoc}`;
export type AddFriendMutationFn = Apollo.MutationFunction<AddFriendMutation, AddFriendMutationVariables>;

/**
 * __useAddFriendMutation__
 *
 * To run a mutation, you first call `useAddFriendMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddFriendMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addFriendMutation, { data, loading, error }] = useAddFriendMutation({
 *   variables: {
 *      from: // value for 'from'
 *      to: // value for 'to'
 *   },
 * });
 */
export function useAddFriendMutation(baseOptions?: Apollo.MutationHookOptions<AddFriendMutation, AddFriendMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddFriendMutation, AddFriendMutationVariables>(AddFriendDocument, options);
      }
export type AddFriendMutationHookResult = ReturnType<typeof useAddFriendMutation>;
export type AddFriendMutationResult = Apollo.MutationResult<AddFriendMutation>;
export type AddFriendMutationOptions = Apollo.BaseMutationOptions<AddFriendMutation, AddFriendMutationVariables>;
export const AddTeamToSeasonGroupDocument = gql`
    mutation addTeamToSeasonGroup($teamID: String, $_id: String) {
  addTeamToSeasonGroup(teamID: $teamID, _id: $_id) {
    _id
    team {
      name
      image
      _id
    }
  }
}
    `;
export type AddTeamToSeasonGroupMutationFn = Apollo.MutationFunction<AddTeamToSeasonGroupMutation, AddTeamToSeasonGroupMutationVariables>;

/**
 * __useAddTeamToSeasonGroupMutation__
 *
 * To run a mutation, you first call `useAddTeamToSeasonGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddTeamToSeasonGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addTeamToSeasonGroupMutation, { data, loading, error }] = useAddTeamToSeasonGroupMutation({
 *   variables: {
 *      teamID: // value for 'teamID'
 *      _id: // value for '_id'
 *   },
 * });
 */
export function useAddTeamToSeasonGroupMutation(baseOptions?: Apollo.MutationHookOptions<AddTeamToSeasonGroupMutation, AddTeamToSeasonGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddTeamToSeasonGroupMutation, AddTeamToSeasonGroupMutationVariables>(AddTeamToSeasonGroupDocument, options);
      }
export type AddTeamToSeasonGroupMutationHookResult = ReturnType<typeof useAddTeamToSeasonGroupMutation>;
export type AddTeamToSeasonGroupMutationResult = Apollo.MutationResult<AddTeamToSeasonGroupMutation>;
export type AddTeamToSeasonGroupMutationOptions = Apollo.BaseMutationOptions<AddTeamToSeasonGroupMutation, AddTeamToSeasonGroupMutationVariables>;
export const ArchiveSeasonDocument = gql`
    mutation archiveSeason($_id: String, $value: Boolean) {
  archiveSeason(_id: $_id, value: $value)
}
    `;
export type ArchiveSeasonMutationFn = Apollo.MutationFunction<ArchiveSeasonMutation, ArchiveSeasonMutationVariables>;

/**
 * __useArchiveSeasonMutation__
 *
 * To run a mutation, you first call `useArchiveSeasonMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useArchiveSeasonMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [archiveSeasonMutation, { data, loading, error }] = useArchiveSeasonMutation({
 *   variables: {
 *      _id: // value for '_id'
 *      value: // value for 'value'
 *   },
 * });
 */
export function useArchiveSeasonMutation(baseOptions?: Apollo.MutationHookOptions<ArchiveSeasonMutation, ArchiveSeasonMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ArchiveSeasonMutation, ArchiveSeasonMutationVariables>(ArchiveSeasonDocument, options);
      }
export type ArchiveSeasonMutationHookResult = ReturnType<typeof useArchiveSeasonMutation>;
export type ArchiveSeasonMutationResult = Apollo.MutationResult<ArchiveSeasonMutation>;
export type ArchiveSeasonMutationOptions = Apollo.BaseMutationOptions<ArchiveSeasonMutation, ArchiveSeasonMutationVariables>;
export const CreateSeasonDocument = gql`
    mutation createSeason($data: SeasonInput) {
  createSeason(data: $data) {
    ...SeasonFragment
  }
}
    ${SeasonFragmentFragmentDoc}`;
export type CreateSeasonMutationFn = Apollo.MutationFunction<CreateSeasonMutation, CreateSeasonMutationVariables>;

/**
 * __useCreateSeasonMutation__
 *
 * To run a mutation, you first call `useCreateSeasonMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSeasonMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSeasonMutation, { data, loading, error }] = useCreateSeasonMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateSeasonMutation(baseOptions?: Apollo.MutationHookOptions<CreateSeasonMutation, CreateSeasonMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSeasonMutation, CreateSeasonMutationVariables>(CreateSeasonDocument, options);
      }
export type CreateSeasonMutationHookResult = ReturnType<typeof useCreateSeasonMutation>;
export type CreateSeasonMutationResult = Apollo.MutationResult<CreateSeasonMutation>;
export type CreateSeasonMutationOptions = Apollo.BaseMutationOptions<CreateSeasonMutation, CreateSeasonMutationVariables>;
export const CreateSeasonGamesDocument = gql`
    mutation createSeasonGames($games: [SeasonGameInput], $seasonId: String) {
  createSeasonGames(games: $games, seasonId: $seasonId) {
    ...SeasonGroupGameFrag
  }
}
    ${SeasonGroupGameFragFragmentDoc}`;
export type CreateSeasonGamesMutationFn = Apollo.MutationFunction<CreateSeasonGamesMutation, CreateSeasonGamesMutationVariables>;

/**
 * __useCreateSeasonGamesMutation__
 *
 * To run a mutation, you first call `useCreateSeasonGamesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSeasonGamesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSeasonGamesMutation, { data, loading, error }] = useCreateSeasonGamesMutation({
 *   variables: {
 *      games: // value for 'games'
 *      seasonId: // value for 'seasonId'
 *   },
 * });
 */
export function useCreateSeasonGamesMutation(baseOptions?: Apollo.MutationHookOptions<CreateSeasonGamesMutation, CreateSeasonGamesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSeasonGamesMutation, CreateSeasonGamesMutationVariables>(CreateSeasonGamesDocument, options);
      }
export type CreateSeasonGamesMutationHookResult = ReturnType<typeof useCreateSeasonGamesMutation>;
export type CreateSeasonGamesMutationResult = Apollo.MutationResult<CreateSeasonGamesMutation>;
export type CreateSeasonGamesMutationOptions = Apollo.BaseMutationOptions<CreateSeasonGamesMutation, CreateSeasonGamesMutationVariables>;
export const ReadNoticeDocument = gql`
    mutation readNotice($_id: String) {
  readNotice(_id: $_id)
}
    `;
export type ReadNoticeMutationFn = Apollo.MutationFunction<ReadNoticeMutation, ReadNoticeMutationVariables>;

/**
 * __useReadNoticeMutation__
 *
 * To run a mutation, you first call `useReadNoticeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReadNoticeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [readNoticeMutation, { data, loading, error }] = useReadNoticeMutation({
 *   variables: {
 *      _id: // value for '_id'
 *   },
 * });
 */
export function useReadNoticeMutation(baseOptions?: Apollo.MutationHookOptions<ReadNoticeMutation, ReadNoticeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ReadNoticeMutation, ReadNoticeMutationVariables>(ReadNoticeDocument, options);
      }
export type ReadNoticeMutationHookResult = ReturnType<typeof useReadNoticeMutation>;
export type ReadNoticeMutationResult = Apollo.MutationResult<ReadNoticeMutation>;
export type ReadNoticeMutationOptions = Apollo.BaseMutationOptions<ReadNoticeMutation, ReadNoticeMutationVariables>;
export const RecoverDocument = gql`
    mutation recover($data: RecoveryInput) {
  recover(data: $data)
}
    `;
export type RecoverMutationFn = Apollo.MutationFunction<RecoverMutation, RecoverMutationVariables>;

/**
 * __useRecoverMutation__
 *
 * To run a mutation, you first call `useRecoverMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRecoverMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [recoverMutation, { data, loading, error }] = useRecoverMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useRecoverMutation(baseOptions?: Apollo.MutationHookOptions<RecoverMutation, RecoverMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RecoverMutation, RecoverMutationVariables>(RecoverDocument, options);
      }
export type RecoverMutationHookResult = ReturnType<typeof useRecoverMutation>;
export type RecoverMutationResult = Apollo.MutationResult<RecoverMutation>;
export type RecoverMutationOptions = Apollo.BaseMutationOptions<RecoverMutation, RecoverMutationVariables>;
export const RemoveTeamFromSeasonGroupDocument = gql`
    mutation removeTeamFromSeasonGroup($teamID: String, $_id: String, $group: String) {
  removeTeamFromSeasonGroup(teamID: $teamID, _id: $_id, group: $group)
}
    `;
export type RemoveTeamFromSeasonGroupMutationFn = Apollo.MutationFunction<RemoveTeamFromSeasonGroupMutation, RemoveTeamFromSeasonGroupMutationVariables>;

/**
 * __useRemoveTeamFromSeasonGroupMutation__
 *
 * To run a mutation, you first call `useRemoveTeamFromSeasonGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveTeamFromSeasonGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeTeamFromSeasonGroupMutation, { data, loading, error }] = useRemoveTeamFromSeasonGroupMutation({
 *   variables: {
 *      teamID: // value for 'teamID'
 *      _id: // value for '_id'
 *      group: // value for 'group'
 *   },
 * });
 */
export function useRemoveTeamFromSeasonGroupMutation(baseOptions?: Apollo.MutationHookOptions<RemoveTeamFromSeasonGroupMutation, RemoveTeamFromSeasonGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveTeamFromSeasonGroupMutation, RemoveTeamFromSeasonGroupMutationVariables>(RemoveTeamFromSeasonGroupDocument, options);
      }
export type RemoveTeamFromSeasonGroupMutationHookResult = ReturnType<typeof useRemoveTeamFromSeasonGroupMutation>;
export type RemoveTeamFromSeasonGroupMutationResult = Apollo.MutationResult<RemoveTeamFromSeasonGroupMutation>;
export type RemoveTeamFromSeasonGroupMutationOptions = Apollo.BaseMutationOptions<RemoveTeamFromSeasonGroupMutation, RemoveTeamFromSeasonGroupMutationVariables>;
export const SaveSettingDocument = gql`
    mutation saveSetting($_id: String, $data: SettingInput) {
  saveSetting(_id: $_id, data: $data) {
    _id
    status
    date
    type
    key
    desc
    default
    user_id
    __typename
  }
}
    `;
export type SaveSettingMutationFn = Apollo.MutationFunction<SaveSettingMutation, SaveSettingMutationVariables>;

/**
 * __useSaveSettingMutation__
 *
 * To run a mutation, you first call `useSaveSettingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSaveSettingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [saveSettingMutation, { data, loading, error }] = useSaveSettingMutation({
 *   variables: {
 *      _id: // value for '_id'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useSaveSettingMutation(baseOptions?: Apollo.MutationHookOptions<SaveSettingMutation, SaveSettingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SaveSettingMutation, SaveSettingMutationVariables>(SaveSettingDocument, options);
      }
export type SaveSettingMutationHookResult = ReturnType<typeof useSaveSettingMutation>;
export type SaveSettingMutationResult = Apollo.MutationResult<SaveSettingMutation>;
export type SaveSettingMutationOptions = Apollo.BaseMutationOptions<SaveSettingMutation, SaveSettingMutationVariables>;
export const SignUpDocument = gql`
    mutation signUp($user: UserCreateInput) {
  signUp(user: $user) {
    _id
    name
    username
    image
    id
    first_name
    last_name
    phone
    email
  }
}
    `;
export type SignUpMutationFn = Apollo.MutationFunction<SignUpMutation, SignUpMutationVariables>;

/**
 * __useSignUpMutation__
 *
 * To run a mutation, you first call `useSignUpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignUpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signUpMutation, { data, loading, error }] = useSignUpMutation({
 *   variables: {
 *      user: // value for 'user'
 *   },
 * });
 */
export function useSignUpMutation(baseOptions?: Apollo.MutationHookOptions<SignUpMutation, SignUpMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignUpMutation, SignUpMutationVariables>(SignUpDocument, options);
      }
export type SignUpMutationHookResult = ReturnType<typeof useSignUpMutation>;
export type SignUpMutationResult = Apollo.MutationResult<SignUpMutation>;
export type SignUpMutationOptions = Apollo.BaseMutationOptions<SignUpMutation, SignUpMutationVariables>;
export const AuthDocument = gql`
    query auth($username: String!, $password: String!) {
  auth(username: $username, password: $password) {
    _id
    name
    username
    image
    id
    first_name
    last_name
    phone
    email
  }
}
    `;

/**
 * __useAuthQuery__
 *
 * To run a query within a React component, call `useAuthQuery` and pass it any options that fit your needs.
 * When your component renders, `useAuthQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAuthQuery({
 *   variables: {
 *      username: // value for 'username'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useAuthQuery(baseOptions: Apollo.QueryHookOptions<AuthQuery, AuthQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AuthQuery, AuthQueryVariables>(AuthDocument, options);
      }
export function useAuthLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AuthQuery, AuthQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AuthQuery, AuthQueryVariables>(AuthDocument, options);
        }
export type AuthQueryHookResult = ReturnType<typeof useAuthQuery>;
export type AuthLazyQueryHookResult = ReturnType<typeof useAuthLazyQuery>;
export type AuthQueryResult = Apollo.QueryResult<AuthQuery, AuthQueryVariables>;
export const FriendsDocument = gql`
    query friends($_id: String) {
  friends(_id: $_id) {
    ...RelationShipFrag
  }
}
    ${RelationShipFragFragmentDoc}`;

/**
 * __useFriendsQuery__
 *
 * To run a query within a React component, call `useFriendsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFriendsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFriendsQuery({
 *   variables: {
 *      _id: // value for '_id'
 *   },
 * });
 */
export function useFriendsQuery(baseOptions?: Apollo.QueryHookOptions<FriendsQuery, FriendsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FriendsQuery, FriendsQueryVariables>(FriendsDocument, options);
      }
export function useFriendsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FriendsQuery, FriendsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FriendsQuery, FriendsQueryVariables>(FriendsDocument, options);
        }
export type FriendsQueryHookResult = ReturnType<typeof useFriendsQuery>;
export type FriendsLazyQueryHookResult = ReturnType<typeof useFriendsLazyQuery>;
export type FriendsQueryResult = Apollo.QueryResult<FriendsQuery, FriendsQueryVariables>;
export const GetSettingDocument = gql`
    query getSetting($_id: String, $key: String) {
  getSetting(_id: $_id, key: $key) {
    _id
    status
    date
    type
    key
    desc
    default
    user_id
    __typename
  }
}
    `;

/**
 * __useGetSettingQuery__
 *
 * To run a query within a React component, call `useGetSettingQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSettingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSettingQuery({
 *   variables: {
 *      _id: // value for '_id'
 *      key: // value for 'key'
 *   },
 * });
 */
export function useGetSettingQuery(baseOptions?: Apollo.QueryHookOptions<GetSettingQuery, GetSettingQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSettingQuery, GetSettingQueryVariables>(GetSettingDocument, options);
      }
export function useGetSettingLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSettingQuery, GetSettingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSettingQuery, GetSettingQueryVariables>(GetSettingDocument, options);
        }
export type GetSettingQueryHookResult = ReturnType<typeof useGetSettingQuery>;
export type GetSettingLazyQueryHookResult = ReturnType<typeof useGetSettingLazyQuery>;
export type GetSettingQueryResult = Apollo.QueryResult<GetSettingQuery, GetSettingQueryVariables>;
export const GetSettingsDocument = gql`
    query getSettings($_id: String) {
  getSettings(_id: $_id) {
    _id
    status
    date
    type
    key
    desc
    default
    user_id
    __typename
  }
}
    `;

/**
 * __useGetSettingsQuery__
 *
 * To run a query within a React component, call `useGetSettingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSettingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSettingsQuery({
 *   variables: {
 *      _id: // value for '_id'
 *   },
 * });
 */
export function useGetSettingsQuery(baseOptions?: Apollo.QueryHookOptions<GetSettingsQuery, GetSettingsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSettingsQuery, GetSettingsQueryVariables>(GetSettingsDocument, options);
      }
export function useGetSettingsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSettingsQuery, GetSettingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSettingsQuery, GetSettingsQueryVariables>(GetSettingsDocument, options);
        }
export type GetSettingsQueryHookResult = ReturnType<typeof useGetSettingsQuery>;
export type GetSettingsLazyQueryHookResult = ReturnType<typeof useGetSettingsLazyQuery>;
export type GetSettingsQueryResult = Apollo.QueryResult<GetSettingsQuery, GetSettingsQueryVariables>;
export const NoticeDocument = gql`
    query notice($_id: String) {
  notices(_id: $_id) {
    _id
    date
    context {
      body
      title
      date
      status
      __typename
    }
    actionData {
      context
      contextId
      isBlock
      contextTarget {
        type
        _id
      }
    }
  }
}
    `;

/**
 * __useNoticeQuery__
 *
 * To run a query within a React component, call `useNoticeQuery` and pass it any options that fit your needs.
 * When your component renders, `useNoticeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNoticeQuery({
 *   variables: {
 *      _id: // value for '_id'
 *   },
 * });
 */
export function useNoticeQuery(baseOptions?: Apollo.QueryHookOptions<NoticeQuery, NoticeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NoticeQuery, NoticeQueryVariables>(NoticeDocument, options);
      }
export function useNoticeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NoticeQuery, NoticeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NoticeQuery, NoticeQueryVariables>(NoticeDocument, options);
        }
export type NoticeQueryHookResult = ReturnType<typeof useNoticeQuery>;
export type NoticeLazyQueryHookResult = ReturnType<typeof useNoticeLazyQuery>;
export type NoticeQueryResult = Apollo.QueryResult<NoticeQuery, NoticeQueryVariables>;
export const NoticesDocument = gql`
    query notices($_id: String, $type: String) {
  notices(_id: $_id, type: $type) {
    _id
    date
    context {
      body
      title
      date
      status
      __typename
    }
    actionData {
      context
      contextId
      isBlock
      contextTarget {
        type
        _id
      }
    }
  }
}
    `;

/**
 * __useNoticesQuery__
 *
 * To run a query within a React component, call `useNoticesQuery` and pass it any options that fit your needs.
 * When your component renders, `useNoticesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNoticesQuery({
 *   variables: {
 *      _id: // value for '_id'
 *      type: // value for 'type'
 *   },
 * });
 */
export function useNoticesQuery(baseOptions?: Apollo.QueryHookOptions<NoticesQuery, NoticesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NoticesQuery, NoticesQueryVariables>(NoticesDocument, options);
      }
export function useNoticesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NoticesQuery, NoticesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NoticesQuery, NoticesQueryVariables>(NoticesDocument, options);
        }
export type NoticesQueryHookResult = ReturnType<typeof useNoticesQuery>;
export type NoticesLazyQueryHookResult = ReturnType<typeof useNoticesLazyQuery>;
export type NoticesQueryResult = Apollo.QueryResult<NoticesQuery, NoticesQueryVariables>;
export const PendingDocument = gql`
    query pending($_id: String) {
  pending(_id: $_id) {
    ...RelationShipFrag
  }
}
    ${RelationShipFragFragmentDoc}`;

/**
 * __usePendingQuery__
 *
 * To run a query within a React component, call `usePendingQuery` and pass it any options that fit your needs.
 * When your component renders, `usePendingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePendingQuery({
 *   variables: {
 *      _id: // value for '_id'
 *   },
 * });
 */
export function usePendingQuery(baseOptions?: Apollo.QueryHookOptions<PendingQuery, PendingQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PendingQuery, PendingQueryVariables>(PendingDocument, options);
      }
export function usePendingLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PendingQuery, PendingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PendingQuery, PendingQueryVariables>(PendingDocument, options);
        }
export type PendingQueryHookResult = ReturnType<typeof usePendingQuery>;
export type PendingLazyQueryHookResult = ReturnType<typeof usePendingLazyQuery>;
export type PendingQueryResult = Apollo.QueryResult<PendingQuery, PendingQueryVariables>;
export const SearchDocument = gql`
    query search($query: String) {
  search(query: $query) {
    people {
      _id
      name
      image
      email
      followers {
        _id
      }
    }
    events {
      ...EVENTS_FRAG
    }
    training {
      _id
      title
      description
      date
      type
      user {
        _id
        name
        image
      }
      file {
        _id
        url
        user {
          ...AsyncPostUserFragment
        }
        name
        type
        video {
          _id
          src
        }
      }
    }
    posts {
      ...AsyncPostFrag
      sharedObject {
        _id
        type
        POST {
          ...AsyncPostFrag
        }
        SESSIONFILE {
          _id
          status
          date
          commentCount
          commentType
          description
          link
          isFavoured
          isOwner
        }
      }
    }
    teams {
      _id
      name
      image
      email
      followers {
        _id
      }
    }
    clubs {
      _id
      name
      image
      email
      followers {
        _id
      }
    }
    institutions {
      _id
      name
      image
      email
      followers {
        _id
      }
    }
    tournaments {
      _id
      name
      image
      email
      followers {
        _id
      }
    }
  }
}
    ${Events_FragFragmentDoc}
${AsyncPostUserFragmentFragmentDoc}
${AsyncPostFragFragmentDoc}`;

/**
 * __useSearchQuery__
 *
 * To run a query within a React component, call `useSearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchQuery({
 *   variables: {
 *      query: // value for 'query'
 *   },
 * });
 */
export function useSearchQuery(baseOptions?: Apollo.QueryHookOptions<SearchQuery, SearchQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchQuery, SearchQueryVariables>(SearchDocument, options);
      }
export function useSearchLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchQuery, SearchQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchQuery, SearchQueryVariables>(SearchDocument, options);
        }
export type SearchQueryHookResult = ReturnType<typeof useSearchQuery>;
export type SearchLazyQueryHookResult = ReturnType<typeof useSearchLazyQuery>;
export type SearchQueryResult = Apollo.QueryResult<SearchQuery, SearchQueryVariables>;
export const SeasonDocument = gql`
    query season($_id: String) {
  season(_id: $_id) {
    ...SeasonFragment
  }
}
    ${SeasonFragmentFragmentDoc}`;

/**
 * __useSeasonQuery__
 *
 * To run a query within a React component, call `useSeasonQuery` and pass it any options that fit your needs.
 * When your component renders, `useSeasonQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSeasonQuery({
 *   variables: {
 *      _id: // value for '_id'
 *   },
 * });
 */
export function useSeasonQuery(baseOptions?: Apollo.QueryHookOptions<SeasonQuery, SeasonQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SeasonQuery, SeasonQueryVariables>(SeasonDocument, options);
      }
export function useSeasonLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SeasonQuery, SeasonQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SeasonQuery, SeasonQueryVariables>(SeasonDocument, options);
        }
export type SeasonQueryHookResult = ReturnType<typeof useSeasonQuery>;
export type SeasonLazyQueryHookResult = ReturnType<typeof useSeasonLazyQuery>;
export type SeasonQueryResult = Apollo.QueryResult<SeasonQuery, SeasonQueryVariables>;
export const SeasonGamesDocument = gql`
    query seasonGames($_id: String) {
  seasonGames(_id: $_id) {
    _id
    game {
      _id
    }
  }
}
    `;

/**
 * __useSeasonGamesQuery__
 *
 * To run a query within a React component, call `useSeasonGamesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSeasonGamesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSeasonGamesQuery({
 *   variables: {
 *      _id: // value for '_id'
 *   },
 * });
 */
export function useSeasonGamesQuery(baseOptions?: Apollo.QueryHookOptions<SeasonGamesQuery, SeasonGamesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SeasonGamesQuery, SeasonGamesQueryVariables>(SeasonGamesDocument, options);
      }
export function useSeasonGamesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SeasonGamesQuery, SeasonGamesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SeasonGamesQuery, SeasonGamesQueryVariables>(SeasonGamesDocument, options);
        }
export type SeasonGamesQueryHookResult = ReturnType<typeof useSeasonGamesQuery>;
export type SeasonGamesLazyQueryHookResult = ReturnType<typeof useSeasonGamesLazyQuery>;
export type SeasonGamesQueryResult = Apollo.QueryResult<SeasonGamesQuery, SeasonGamesQueryVariables>;
export const SeasonGroupsDocument = gql`
    query seasonGroups($_id: String) {
  seasonGroups(_id: $_id) {
    ...SeasonGroupFragment
  }
}
    ${SeasonGroupFragmentFragmentDoc}`;

/**
 * __useSeasonGroupsQuery__
 *
 * To run a query within a React component, call `useSeasonGroupsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSeasonGroupsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSeasonGroupsQuery({
 *   variables: {
 *      _id: // value for '_id'
 *   },
 * });
 */
export function useSeasonGroupsQuery(baseOptions?: Apollo.QueryHookOptions<SeasonGroupsQuery, SeasonGroupsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SeasonGroupsQuery, SeasonGroupsQueryVariables>(SeasonGroupsDocument, options);
      }
export function useSeasonGroupsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SeasonGroupsQuery, SeasonGroupsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SeasonGroupsQuery, SeasonGroupsQueryVariables>(SeasonGroupsDocument, options);
        }
export type SeasonGroupsQueryHookResult = ReturnType<typeof useSeasonGroupsQuery>;
export type SeasonGroupsLazyQueryHookResult = ReturnType<typeof useSeasonGroupsLazyQuery>;
export type SeasonGroupsQueryResult = Apollo.QueryResult<SeasonGroupsQuery, SeasonGroupsQueryVariables>;
export const UsersDocument = gql`
    query users {
  users {
    _id
    name
    image
  }
}
    `;

/**
 * __useUsersQuery__
 *
 * To run a query within a React component, call `useUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useUsersQuery(baseOptions?: Apollo.QueryHookOptions<UsersQuery, UsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
      }
export function useUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UsersQuery, UsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
        }
export type UsersQueryHookResult = ReturnType<typeof useUsersQuery>;
export type UsersLazyQueryHookResult = ReturnType<typeof useUsersLazyQuery>;
export type UsersQueryResult = Apollo.QueryResult<UsersQuery, UsersQueryVariables>;