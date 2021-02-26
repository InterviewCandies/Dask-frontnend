import React, { useState } from "react";
import {
  Board,
  DEFAULT_AVATAR,
  MAXIMUM_MEMBERS_DISPLAYED_PER_CARD,
  User,
} from "../../types";

import CustomImage from "../common/CustomImage/CustomImage";

const Avatar = (props: { photoUrl: any }) => {
  return (
    <CustomImage
      className="w-9 h-9 rounded-xl"
      src={props.photoUrl || DEFAULT_AVATAR}
    ></CustomImage>
  );
};

const displayMembers = (members: User[]) => {
  const shortend =
    members.length > MAXIMUM_MEMBERS_DISPLAYED_PER_CARD ? (
      <span className="text-xs text-gray-400">
        + {members.length - MAXIMUM_MEMBERS_DISPLAYED_PER_CARD} others
      </span>
    ) : null;
  return (
    <div className="flex space-x-2 items-center">
      {members.map((member, i) => {
        return i < MAXIMUM_MEMBERS_DISPLAYED_PER_CARD ? (
          <Avatar photoUrl={member.photoURL} key={member.email}></Avatar>
        ) : null;
      })}
      {shortend}
    </div>
  );
};
function Card(props: { board: Board; onClick: Function }) {
  return (
    <div
      className="bg-white rounded-xl p-4 shadow"
      onClick={() => props.onClick()}
    >
      <div>
        <CustomImage
          className="w-full h-48 rounded-lg"
          src={props.board.coverURL as string}
        ></CustomImage>
      </div>
      <h1 className="font-bold my-4 text-lg capitalize break-words">
        {props.board.title}
      </h1>
      {props.board.members && displayMembers(props.board.members)}
    </div>
  );
}

export default Card;
