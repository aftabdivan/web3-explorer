import React from 'react'
import Avatar from 'react-avatar'
import { Link } from 'react-router-dom'

import { capitalizeWord } from '@util/utils'

import { User } from '../types'

type HeaderProps = {
  currentUser: User | null
  logout: () => void
}

const Header: React.FC<HeaderProps> = ({ currentUser, logout }) => {
  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          Web3 Explorer
        </Link>
        <nav>
          {currentUser ? (
            <div className="user-info">
              <span className="me-2">
                Welcome, {capitalizeWord(currentUser.username)}!
              </span>
              {/* <img
                src={currentUser.avatar}
                alt={currentUser.username}
                className="avatar"
              /> */}
              <Avatar
                name={currentUser.username}
                className="me-2"
                size="40"
                round={true}
              />
              <button onClick={logout} className="btn btn-secondary">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-secondary">
                Login
              </Link>
              <Link
                to="/signup"
                className="btn btn-primary"
                style={{ marginLeft: '0.5rem' }}
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header
