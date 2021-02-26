import React from "react";
import { DEFAULT_AVATAR, User } from "../../types";
import CustomImage from "../common/CustomImage/CustomImage";

const Avatar = (props: { photoUrl: any }) => {
  return (
    <CustomImage
      className="w-8 h-8 rounded"
      src={props.photoUrl || DEFAULT_AVATAR}
    ></CustomImage>
  );
};

const Cell = ({ num }: { num: number }) => {
  return (
    <div className="w-8 h-8 bg-black rounded flex justify-center items-center opacity-30">
      <p className="text-white">{num}+</p>
    </div>
  );
};

const displayMembers = (members: User[], limit: number) => {
  const shortend =
    members.length > limit ? <Cell num={members.length - limit}></Cell> : null;
  return (
    <div className="flex space-x-2">
      {members.map((member, i) => {
        return i < limit ? <Avatar photoUrl={member.photoURL}></Avatar> : null;
      })}
      {shortend}
    </div>
  );
};

function Avatars({ members, limit }: { members: User[]; limit: number }) {
  return <div>{displayMembers(members, limit)}</div>;
}

export default Avatars;
