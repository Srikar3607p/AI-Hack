import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader } from '../components/common/Loader';
import { ROLES } from '../constants/roles';

/**
 * Maps each role to its home dashboard path.
 * Used to redirect users who try to access a role they don't have.
 */
const ROLE_HOME = {
  [ROLES.CITIZEN]: '/citizen/dashboard',
  [ROLES.OFFICER]: '/officer/dashboard',
  [ROLES.ADMIN]: '/admin/dashboard',
  [ROLES.SUPER_ADMIN]: '/super-admin/dashboard'
};

/**
 * RoleBasedRoute — wraps ProtectedRoute with role verification.
 *
 * Props:
 *   allowedRoles  string[]  — which roles may access this route
 *   children      ReactNode — the page to render when permitted
 *
 * If the user's role isn't in allowedRoles they are redirected to their
 * own role's home dashboard rather than getting a blank error.
 */
export const RoleBasedRoute = ({ allowedRoles = [], children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loader message="Verifying permissions..." size="lg" />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    const home = ROLE_HOME[user.role] || '/';
    return <Navigate to={home} replace />;
  }

  return children;
};
