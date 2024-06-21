import { User, Team, Club, Tournament, Institution } from "~/DB/interfaces";

export type UnionUser = User | Team | Club | Tournament | Institution
