/* eslint-env vitest */
import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProtectedAdminRoute from '../ProtectedAdminRoute'

// cleanup after each test so localStorage state doesn't leak
afterEach(() => localStorage.clear())

test('renders its children when adminUser exists in localStorage', () => {
    localStorage.setItem(
        'adminUser',
        JSON.stringify({ id: 1, name: 'Admin' })
    )

    render(
        <MemoryRouter>
            <ProtectedAdminRoute>
                <div>SECRET</div>
            </ProtectedAdminRoute>
        </MemoryRouter>
    )

    expect(screen.getByText('SECRET')).toBeInTheDocument()
})

test('when adminUser is missing, does NOT render children', () => {
    render(
        <MemoryRouter>
            <ProtectedAdminRoute>
                <div>SECRET</div>
            </ProtectedAdminRoute>
        </MemoryRouter>
    )

    expect(screen.queryByText('SECRET')).toBeNull()
})
