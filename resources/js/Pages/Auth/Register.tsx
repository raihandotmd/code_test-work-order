"use client"

import InputError from "@/Components/InputError"
import InputLabel from "@/Components/InputLabel"
import PrimaryButton from "@/Components/PrimaryButton"
import TextInput from "@/Components/TextInput"
import GuestLayout from "@/Layouts/GuestLayout"
import { Head, Link, useForm } from "@inertiajs/react"
import type { FormEventHandler } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/Select"

interface Role {
  id: string
  name: string
}

interface RegisterProps {
  roles: Role[]
}

export default function Register({ roles }: RegisterProps) {
  const { data, setData, post, processing, errors, reset } = useForm({
    username: "",
    name: "",
    role_id: "",
    password: "",
    password_confirmation: "",
  })

  const submit: FormEventHandler = (e) => {
    e.preventDefault()

    post(route("register"), {
      onFinish: () => reset("password", "password_confirmation"),
    })
  }

  return (
    <GuestLayout>
      <Head title="Register" />

      <form onSubmit={submit}>
        <div>
          <InputLabel htmlFor="username" value="Username" />

          <TextInput
            id="username"
            name="username"
            value={data.username}
            className="mt-1 block w-full"
            autoComplete="username"
            onChange={(e) => setData("username", e.target.value)}
            required
          />

          <InputError message={errors.username} className="mt-2" />
        </div>

        <div className="mt-4">
          <InputLabel htmlFor="name" value="Name" />

          <TextInput
            id="name"
            name="name"
            value={data.name}
            className="mt-1 block w-full"
            autoComplete="name"
            isFocused={true}
            onChange={(e) => setData("name", e.target.value)}
            required
          />

          <InputError message={errors.name} className="mt-2" />
        </div>

        <div className="mt-4">
          <InputLabel htmlFor="role_id" value="User Role" />

          <Select value={data.role_id} onValueChange={(value) => setData("role_id", value)}>
            <SelectTrigger id="role_id" className="mt-1 w-full">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <InputError message={errors.role_id} className="mt-2" />
        </div>

        <div className="mt-4">
          <InputLabel htmlFor="password" value="Password" />

          <TextInput
            id="password"
            type="password"
            name="password"
            value={data.password}
            className="mt-1 block w-full"
            autoComplete="new-password"
            onChange={(e) => setData("password", e.target.value)}
            required
          />

          <InputError message={errors.password} className="mt-2" />
        </div>

        <div className="mt-4">
          <InputLabel htmlFor="password_confirmation" value="Confirm Password" />

          <TextInput
            id="password_confirmation"
            type="password"
            name="password_confirmation"
            value={data.password_confirmation}
            className="mt-1 block w-full"
            autoComplete="new-password"
            onChange={(e) => setData("password_confirmation", e.target.value)}
            required
          />

          <InputError message={errors.password_confirmation} className="mt-2" />
        </div>

        <div className="mt-4 flex items-center justify-end">
          <Link
            href={route("login")}
            className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
          >
            Already registered?
          </Link>

          <PrimaryButton className="ms-4" disabled={processing}>
            Register
          </PrimaryButton>
        </div>
      </form>
    </GuestLayout>
  )
}


