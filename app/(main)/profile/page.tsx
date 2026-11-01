"use client";

import { ProfileForm } from "@qsweber/auth-kit";
import { DisplayNameForm } from "../../components/DisplayNameForm";

export default function ProfilePage() {
  return (
    <>
      <ProfileForm />
      <DisplayNameForm />
    </>
  );
}
