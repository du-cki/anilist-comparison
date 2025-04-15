"use client";

import React, { useState } from "react";

import clsx from "clsx";

import { LIST_OPTIONS } from "@/utils/common";

import Media from "../common/Media";
import Dropdown from "../common/Dropdown";

import type { ComparedListResponse, ListStatus } from "@/libs/anilist/types";
import MediaSkeleton from "../common/MediaSkeleton";

type Props = {
  media: ComparedListResponse;
  listStatus: ListStatus;
  isDisabled: boolean;

  onListChange?: (status: ListStatus) => void;
};

export default function ListView({
  media,
  listStatus,
  isDisabled,

  onListChange,
}: Props) {
  const [currentlyOpened, setCurrentlyOpened] = useState(
    null as Option<number>
  );

  return (
    <div>
      <Dropdown
        options={LIST_OPTIONS.map((option) => ({
          ...option,
          disabled: option.value == listStatus,
        }))}
        defaultValue={LIST_OPTIONS.find((o) => o.value === listStatus)}
        className={clsx("w-40 mb-4", isDisabled && "opacity-50 cursor-pointer")}
        isDisabled={isDisabled}
        isSearchable={false}
        onChange={(option) => {
          if (option) onListChange?.(option.value);
        }}
      />

      <div className="space-y-6 mt-10">
        {isDisabled ? (
          <>
            <MediaSkeleton />
            <MediaSkeleton />
            <MediaSkeleton />
            <MediaSkeleton />
            <MediaSkeleton />
          </>
        ) : (
          media.map((media) => (
            <Media
              media={media}
              key={media.id}
            />
          ))
        )}
      </div>
    </div>
  );
}
