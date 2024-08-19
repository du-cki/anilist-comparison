import React from "react";

import clsx from "clsx";
import { CARD_BACKGROUND, CARD_COMMON_CLASSES } from "./User";

import type { ComparedListResponse } from "@/libs/anilist/types";
import Image from "next/image";
import moment from "moment";

type Props = {
  media: ComparedListResponse[number];
  isOpened: boolean;
} & React.ComponentProps<"div">;

export default function Media({ media, isOpened, ...props }: Props) {
  return (
    <div className="rounded-lg overflow-clip relative">
      {media.bannerImage && (
        <Image
          src={media.bannerImage}
          alt={`${media.title.romaji}'s banner image`}
          fill={true}
          sizes="100vw"
          className={clsx(
            CARD_BACKGROUND,
            "absolute top-0 left-0 right-0 bottom-0 z-[-1] opacity-50 object-cover"
          )}
        />
      )}

      <div
        className={clsx(
          CARD_COMMON_CLASSES,
          "flex items-center min-h-24 hover:cursor-pointer"
        )}
        {...props}
      >
        <a
          href={`https://anilist.co/anime/${media.id}`}
          className="min-w-[50px] mr-3"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={media.coverImage.medium}
            alt={`${media.title.romaji}'s cover image`}
            width="50"
            height="70"
            className="rounded-md hover:opacity-80 transition-all"
          />
        </a>

        <span className="line-clamp-2">{media.title.romaji}</span>
      </div>

      <div
        className={clsx(
          "w-full transition-all ease-in-out duration-[480ms] p-3",
          "space-y-3 bg-black/10",
          !isOpened && "h-0 py-0 px-0"
        )}
      >
        {Object.entries(media.statuses).map(([user, status]) => (
          <div key={user} className="font-semibold">
            <span className="text-gray-400 text-sm font-semibold">
              <a
                href={`https://anilist.co/user/${user}`}
                className="font-extrabold text-lg default-text hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {user}
              </a>
              {": "}
              (Last Update:{" "}
              {status.updatedAt
                ? moment(status.updatedAt * 1000).fromNow()
                : "N/A"}
              )
            </span>

            <div className="pl-2">
              {[
                ["Volumes", status.progressVolumes ?? false],
                ["Score", `${status.score}/10`],
                [
                  "Episodes",
                  `${status.progress}/${
                    media.episodes || media.chapters || "?"
                  }`,
                ],
                ["Rewatches", status.repeat ?? false],
              ]
                .filter(([_, v]) => v)
                .map(([k, v]) => (
                  <p key={k as string}>
                    ↪ {k}: {v}
                  </p>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
