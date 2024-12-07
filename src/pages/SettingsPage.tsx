import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { motion } from 'framer-motion'
import * as Yup from 'yup'

import { User } from '../types'

type SettingsPageProps = {
  currentUser: User
  updateUser: (user: User) => void
}

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must not exceed 20 characters')
    .required('Username is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phoneNumber: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
  avatar: Yup.string().url('Invalid URL').required('Avatar URL is required'),
})

const SettingsPage: React.FC<SettingsPageProps> = ({
  currentUser,
  updateUser,
}) => {
  const handleSubmit = (
    values: Partial<User>,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    const updatedUser = {
      ...currentUser,
      ...values,
    }
    updateUser(updatedUser)
    toast.success('Profile updated successfully!')
    setSubmitting(false)
  }

  return (
    <div className="settings-page">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        User Settings
      </h2>
      <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg">
        <Formik
          initialValues={{
            username: currentUser.username,
            email: currentUser.email,
            phoneNumber: currentUser.phoneNumber,
            avatar: currentUser.avatar,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Username
                </label>
                <Field
                  type="text"
                  id="username"
                  name="username"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white ${
                    errors.username && touched.username
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email
                </label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white ${
                    errors.email && touched.email
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Phone Number
                </label>
                <Field
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white ${
                    errors.phoneNumber && touched.phoneNumber
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                />
                <ErrorMessage
                  name="phoneNumber"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <label
                  htmlFor="avatar"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Avatar URL
                </label>
                <Field
                  type="text"
                  id="avatar"
                  name="avatar"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white ${
                    errors.avatar && touched.avatar
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                />
                <ErrorMessage
                  name="avatar"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <motion.button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Updating...' : 'Update Profile'}
              </motion.button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default SettingsPage
