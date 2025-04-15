import React from "react";

import clsx from "clsx";

import { toTenPointDecimal } from "@/utils/functions/common";
import { CARD_BACKGROUND, CARD_COMMON_CLASSES } from "./User";

import type { ComparedListResponse } from "@/libs/anilist/types";

type Props = {
  media: ComparedListResponse[number];
};

export default function Media({ media }: Props) {
  return (
    <div className="rounded-lg relative group">
      <div
        className={clsx(
          CARD_BACKGROUND,
          "absolute top-0 left-0 right-0 bottom-0 -z-10 opacity-40 object-cover bg-cover bg-center rounded-lg"
        )}
        style={{ backgroundImage: `url(${media.bannerImage})` }}
      />

      <div
        className={clsx(
          CARD_COMMON_CLASSES,
          "flex items-center h-max"
        )}
      >
        <img
          src={media.coverImage.large}
          alt={`${media.title}'s cover image.`}
          className="rounded-lg shadow-lg scale-125 mx-3 w-20"
        />

        <div className="ml-3 h-max">
          <h1 className="line-clamp-1">{media.title.romaji}</h1>
          <p className="text-sm text-gray-400">{media.seasonYear || "N/A"} • {media.averageScore ? toTenPointDecimal(media.averageScore) : "N/A"}</p>


        </div>
      </div>

    </div>
  );
}
