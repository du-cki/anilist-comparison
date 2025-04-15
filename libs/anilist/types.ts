import { LIST_OPTIONS } from "@/utils/common";

export type AniListError = {
  errors: {
    message: string;
    status: number;
  }[];
  data: null;
};

type BaseResponse<T> = {
  data: T;
};

export type MediaType = "ANIME" | "MANGA";

export type ListStatus = (typeof LIST_OPTIONS)[number]["value"];

export type Media = {
  id: number;
  title: {
    romaji: string;
  };
  coverImage: {
    large: string;
    color: string;
  };
  episodes: Option<string>;
  chapters: Option<string>;
  bannerImage: Option<string>;
  seasonYear: Option<number>;
  averageScore: Option<number>;
};

export type MediaList = {
  lists: {
    name: ListStatus;
    entries: ({
      media: Media;
    } & Status)[];
  }[];
};

export type Status = {
  score: number;
  progress: number;
  progressVolumes: Option<number>; // for mangas
  repeat: number;
  updatedAt: number;
};

export type User = {
  id: number;
  name: string;
  avatar: {
    large: string;
  };
};

export type ComparedListResponse = (Media & {
  statuses: Record<string, Status>;
})[];

export type AniListUserResponse = BaseResponse<Record<string, User>>;
export type AniListMediaResponse = BaseResponse<Record<string, MediaList>>;

export type AniListUserSearchResponse = BaseResponse<{
  users: {
    results: User[];
  };
}>;
