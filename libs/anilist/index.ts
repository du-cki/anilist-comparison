import tag from "@/utils/functions/tag";

import {
  AniListMediaResponse,
  AniListUserResponse,
  AniListUserSearchResponse,
  Media,
  MediaType,
  ListStatus,
  User,
  Status,
  ComparedListResponse,
} from "./types";

type TagParser = (url: Option<string>, text: Option<string>) => string;

const TAG_MAPPING: { [key: string]: TagParser } = {
  a: (url, text) => `[${text}](${url})`,
  br: (_, _text) => "\n",
  i: (_, text) => `__${text}__`,
  b: (_, text) => `**${text}**`,
};

class AniListClient {
  private readonly BASE_URL = "https://graphql.anilist.co/";
  private readonly BASE_HEADERS = {
    "User-Agent":
      "Anilist-Comparison (https://github.com/du-cki/Anilist-Comparison)",
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  private cleanMarkup(text: string) {
    return text.replace(
      /\<(?<tag>[a-zA-Z]+)(?: href=\"(?<url>.*)\")?\>(?:(?<text>[\s\S]+?)\<\/\1\>)?/gim,
      (_: string, tag: string, url: string, text: string) => {
        return TAG_MAPPING[tag]?.(url, text) || text;
      }
    );
  }

  async query<T>({
    query,
    variables,
    headers,
  }: {
    query: string;
    variables?: Record<string, any>;
    headers?: Record<string, string>;
  }): Promise<T> {
    console.log("Querying anilist...");

    const sentHeaders: Record<string, string> = {
      ...this.BASE_HEADERS,
      ...headers,
    };

    const response = await fetch(this.BASE_URL, {
      method: "POST",
      headers: sentHeaders,
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const data = await response.json();

    if (data.errors) {
      throw new Error(JSON.stringify(data.errors));
    }

    return data;
  }

  async fetchUserProfiles({ users }: { users: string[] }): Promise<User[]> {
    const query = tag(`query {{users}}`, {
      users: users.map(
        (user) => `
            ${user}: User(name: "${user}") {
                id,
                name,
                avatar {
                    large
                }
            }
        `
      ),
    });

    const data = await this.query<AniListUserResponse>({
      query,
      variables: {},
    });

    return Object.values(data.data);
  }

  async compareUserMediaLists({
    users,
    mediaType,
    listStatus,
  }: {
    users: string[];
    mediaType?: MediaType;
    listStatus?: ListStatus;
  }): Promise<ComparedListResponse> {
    const query = tag(
      `query ($mediaType: MediaType, $status: MediaListStatus) {{users}}`,
      {
        users: users.map(
          (user) => `
            ${user}: MediaListCollection(userName: "${user}", type: $mediaType, status: $status) {
                lists {
                  name
                  entries {
                    score(format: POINT_10_DECIMAL)
                    progress
                    progressVolumes
                    repeat
                    updatedAt
                    media {
                      id
                      title {
                        romaji
                      }
                      episodes
                      averageScore
                      seasonYear
                      chapters
                      bannerImage
                      coverImage {
                        large
                        color
                      }
                    }
                  }
                }
              }
        `
        ),
      }
    );

    const { data: resp } = await this.query<AniListMediaResponse>({
      query,
      variables: {
        mediaType: mediaType ?? "ANIME",
        status: listStatus ?? "PLANNING",
      },
    });

    const mediaSets = Object.values(resp).map(
      ({ lists }) =>
        new Set(
          lists.flatMap(({ entries }) => entries.map(({ media }) => media.id))
        )
    );

    const commonMediaIDs = mediaSets.reduce(
      (a, b) => new Set([...a].filter((id) => b.has(id)))
    );

    const commonMedia = [
      ...new Map(
        Object.values(resp)
          .flatMap(({ lists }) =>
            lists.flatMap(({ entries }) => entries.map(({ media }) => media))
          )
          .filter(({ id }) => commonMediaIDs.has(id))
          .map((media) => {
            const statuses = Object.entries(resp).reduce(
              (acc, [user, { lists }]) => {
                const entry = lists?.[0]?.entries.find(
                  ({ media: { id } }) => id === media.id
                );

                if (entry) {
                  return {
                    ...acc,
                    [user]: {
                      score: entry.score,
                      progress: entry.progress,
                      progressVolumes: entry.progressVolumes,
                      repeat: entry.repeat,
                      updatedAt: entry.updatedAt,
                    },
                  };
                }

                return acc;
              },
              {} as Record<string, Status>
            );

            return [
              media.id,
              {
                ...media,
                statuses,
              },
            ];
          })
      ).values(),
    ];

    return commonMedia;
  }

  async searchUsers({ search }: { search: string }): Promise<User[]> {
    const query = `
      query ($search: String) {
        users: Page(perPage: 10) {
          results: users(search: $search) {
            id
            name
            avatar {
              large
            }
          }
        }
      }
    `;

    const req = await this.query<AniListUserSearchResponse>({
      query,
      variables: {
        search,
      },
    });

    return req?.data?.users?.results || [];
  }
}

export default AniListClient;
