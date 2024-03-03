/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as PublicImport } from './routes/_public'
import { Route as AuthImport } from './routes/_auth'
import { Route as IndexImport } from './routes/index'
import { Route as PublicIndexImport } from './routes/_public/index'
import { Route as PublicRegisterImport } from './routes/_public/register'
import { Route as PublicLoginImport } from './routes/_public/login'
import { Route as AuthProfileImport } from './routes/_auth/profile'
import { Route as AuthDashboardImport } from './routes/_auth/dashboard'
import { Route as AuthGoalsIndexImport } from './routes/_auth/goals/index'
import { Route as AuthGoalsCreateImport } from './routes/_auth/goals/create'
import { Route as AuthGoalsGoalIdIndexImport } from './routes/_auth/goals/$goalId/index'
import { Route as AuthGoalsGoalIdEditImport } from './routes/_auth/goals/$goalId/edit'

// Create/Update Routes

const PublicRoute = PublicImport.update({
  id: '/_public',
  getParentRoute: () => rootRoute,
} as any)

const AuthRoute = AuthImport.update({
  id: '/_auth',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const PublicIndexRoute = PublicIndexImport.update({
  path: '/',
  getParentRoute: () => PublicRoute,
} as any)

const PublicRegisterRoute = PublicRegisterImport.update({
  path: '/register',
  getParentRoute: () => PublicRoute,
} as any)

const PublicLoginRoute = PublicLoginImport.update({
  path: '/login',
  getParentRoute: () => PublicRoute,
} as any)

const AuthProfileRoute = AuthProfileImport.update({
  path: '/profile',
  getParentRoute: () => AuthRoute,
} as any)

const AuthDashboardRoute = AuthDashboardImport.update({
  path: '/dashboard',
  getParentRoute: () => AuthRoute,
} as any)

const AuthGoalsIndexRoute = AuthGoalsIndexImport.update({
  path: '/goals/',
  getParentRoute: () => AuthRoute,
} as any)

const AuthGoalsCreateRoute = AuthGoalsCreateImport.update({
  path: '/goals/create',
  getParentRoute: () => AuthRoute,
} as any)

const AuthGoalsGoalIdIndexRoute = AuthGoalsGoalIdIndexImport.update({
  path: '/goals/$goalId/',
  getParentRoute: () => AuthRoute,
} as any)

const AuthGoalsGoalIdEditRoute = AuthGoalsGoalIdEditImport.update({
  path: '/goals/$goalId/edit',
  getParentRoute: () => AuthRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/_auth': {
      preLoaderRoute: typeof AuthImport
      parentRoute: typeof rootRoute
    }
    '/_public': {
      preLoaderRoute: typeof PublicImport
      parentRoute: typeof rootRoute
    }
    '/_auth/dashboard': {
      preLoaderRoute: typeof AuthDashboardImport
      parentRoute: typeof AuthImport
    }
    '/_auth/profile': {
      preLoaderRoute: typeof AuthProfileImport
      parentRoute: typeof AuthImport
    }
    '/_public/login': {
      preLoaderRoute: typeof PublicLoginImport
      parentRoute: typeof PublicImport
    }
    '/_public/register': {
      preLoaderRoute: typeof PublicRegisterImport
      parentRoute: typeof PublicImport
    }
    '/_public/': {
      preLoaderRoute: typeof PublicIndexImport
      parentRoute: typeof PublicImport
    }
    '/_auth/goals/create': {
      preLoaderRoute: typeof AuthGoalsCreateImport
      parentRoute: typeof AuthImport
    }
    '/_auth/goals/': {
      preLoaderRoute: typeof AuthGoalsIndexImport
      parentRoute: typeof AuthImport
    }
    '/_auth/goals/$goalId/edit': {
      preLoaderRoute: typeof AuthGoalsGoalIdEditImport
      parentRoute: typeof AuthImport
    }
    '/_auth/goals/$goalId/': {
      preLoaderRoute: typeof AuthGoalsGoalIdIndexImport
      parentRoute: typeof AuthImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  IndexRoute,
  AuthRoute.addChildren([
    AuthDashboardRoute,
    AuthProfileRoute,
    AuthGoalsCreateRoute,
    AuthGoalsIndexRoute,
    AuthGoalsGoalIdEditRoute,
    AuthGoalsGoalIdIndexRoute,
  ]),
  PublicRoute.addChildren([
    PublicLoginRoute,
    PublicRegisterRoute,
    PublicIndexRoute,
  ]),
])

/* prettier-ignore-end */
