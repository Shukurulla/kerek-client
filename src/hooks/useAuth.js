import { useSelector, useDispatch } from "react-redux";
import { useCallback, useEffect } from "react";
import {
  login,
  register,
  verifyCode,
  loginVerify,
  resendCode,
  logout,
  checkAuth,
  clearError,
  setVerificationStep,
  updateUser,
  selectAuth,
  selectIsAuthenticated,
  selectCurrentUser,
  selectAuthLoading,
  selectAuthError,
  selectVerificationStep,
  selectTempUserId,
} from "../store/authSlice";

export const useAuth = () => {
  const dispatch = useDispatch();

  // Selectors
  const auth = useSelector(selectAuth);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const verificationStep = useSelector(selectVerificationStep);
  const tempUserId = useSelector(selectTempUserId);

  // Check authentication on mount
  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(checkAuth());
    }
  }, [dispatch, isAuthenticated]);

  // Auth actions
  const handleRegister = useCallback(
    async (userData) => {
      try {
        const result = await dispatch(register(userData));
        return result.meta.requestStatus === "fulfilled";
      } catch (error) {
        return false;
      }
    },
    [dispatch]
  );

  const handleLogin = useCallback(
    async (phone) => {
      try {
        const result = await dispatch(login(phone));
        return result.meta.requestStatus === "fulfilled";
      } catch (error) {
        return false;
      }
    },
    [dispatch]
  );

  const handleVerifyCode = useCallback(
    async (code) => {
      if (!tempUserId) return false;

      try {
        const result = await dispatch(verifyCode({ userId: tempUserId, code }));
        return result.meta.requestStatus === "fulfilled";
      } catch (error) {
        return false;
      }
    },
    [dispatch, tempUserId]
  );

  const handleLoginVerify = useCallback(
    async (code) => {
      if (!tempUserId) return false;

      try {
        const result = await dispatch(
          loginVerify({ userId: tempUserId, code })
        );
        return result.meta.requestStatus === "fulfilled";
      } catch (error) {
        return false;
      }
    },
    [dispatch, tempUserId]
  );

  const handleResendCode = useCallback(async () => {
    if (!tempUserId) return false;

    try {
      const result = await dispatch(resendCode(tempUserId));
      return result.meta.requestStatus === "fulfilled";
    } catch (error) {
      return false;
    }
  }, [dispatch, tempUserId]);

  const handleLogout = useCallback(async () => {
    try {
      await dispatch(logout());
      return true;
    } catch (error) {
      return false;
    }
  }, [dispatch]);

  const handleUpdateUser = useCallback(
    (userData) => {
      dispatch(updateUser(userData));
    },
    [dispatch]
  );

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSetVerificationStep = useCallback(
    (step) => {
      dispatch(setVerificationStep(step));
    },
    [dispatch]
  );

  // Check if user has specific role
  const hasRole = useCallback(
    (role) => {
      return user?.role === role;
    },
    [user]
  );

  // Check if user has any of the specified roles
  const hasAnyRole = useCallback(
    (roles) => {
      return roles.includes(user?.role);
    },
    [user]
  );

  // Check if user is verified
  const isVerified = useCallback(() => {
    return user?.isVerified === true;
  }, [user]);

  // Check if user has active subscription (for specialists)
  const hasActiveSubscription = useCallback(() => {
    return user?.subscription?.isActive === true;
  }, [user]);

  // Check if user can access a feature
  const canAccessFeature = useCallback(
    (feature) => {
      if (!user) return false;

      switch (feature) {
        case "chat":
          return isAuthenticated && isVerified();
        case "booking":
          return isAuthenticated && isVerified();
        case "specialist_features":
          return (
            hasRole("specialist") && isVerified() && hasActiveSubscription()
          );
        case "admin_panel":
          return hasAnyRole(["admin", "moderator"]);
        default:
          return isAuthenticated;
      }
    },
    [
      user,
      isAuthenticated,
      hasRole,
      hasAnyRole,
      isVerified,
      hasActiveSubscription,
    ]
  );

  // Get user's full name
  const getUserFullName = useCallback(() => {
    if (!user) return "";

    let fullName = user.name || "";
    if (user.lastName) {
      fullName += ` ${user.lastName}`;
    }
    return fullName.trim();
  }, [user]);

  // Get user's avatar URL with fallback
  const getUserAvatar = useCallback(() => {
    if (user?.profileImage) {
      return user.profileImage;
    }

    // Generate default avatar based on name
    const name = getUserFullName() || "User";
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=3b82f6&color=fff&size=128&format=png&rounded=true&bold=true&initials=${initials}`;
  }, [user, getUserFullName]);

  // Check if profile is complete
  const isProfileComplete = useCallback(() => {
    if (!user) return false;

    const requiredFields = ["name", "phone", "city"];

    if (user.role === "specialist") {
      requiredFields.push("description", "categories");
    }

    return requiredFields.every((field) => {
      const value = user[field];
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value && value.toString().trim() !== "";
    });
  }, [user]);

  // Get profile completion percentage
  const getProfileCompletion = useCallback(() => {
    if (!user) return 0;

    const allFields = ["name", "phone", "city", "profileImage", "description"];

    if (user.role === "specialist") {
      allFields.push("categories", "skills", "experience");
    }

    const completedFields = allFields.filter((field) => {
      const value = user[field];
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value && value.toString().trim() !== "";
    });

    return Math.round((completedFields.length / allFields.length) * 100);
  }, [user]);

  // Check if user needs to complete profile
  const needsProfileCompletion = useCallback(() => {
    return getProfileCompletion() < 70; // Less than 70% complete
  }, [getProfileCompletion]);

  // Format user role for display
  const getUserRoleDisplay = useCallback(() => {
    if (!user?.role) return "";

    const roleMap = {
      client: "Mijoz",
      specialist: "Mutaxassis",
      admin: "Administrator",
      moderator: "Moderator",
    };

    return roleMap[user.role] || user.role;
  }, [user]);

  // Check if verification is in progress
  const isVerificationInProgress = useCallback(() => {
    return verificationStep === "code" && tempUserId;
  }, [verificationStep, tempUserId]);

  // Get verification countdown (if needed)
  const getVerificationCountdown = useCallback(() => {
    // This would typically be managed by a separate countdown hook
    // For now, return a default value
    return 60;
  }, []);

  return {
    // State
    user,
    isAuthenticated,
    loading,
    error,
    verificationStep,
    tempUserId,
    auth,

    // Actions
    register: handleRegister,
    login: handleLogin,
    verifyCode: handleVerifyCode,
    loginVerify: handleLoginVerify,
    resendCode: handleResendCode,
    logout: handleLogout,
    updateUser: handleUpdateUser,
    clearError: handleClearError,
    setVerificationStep: handleSetVerificationStep,

    // Utility functions
    hasRole,
    hasAnyRole,
    isVerified,
    hasActiveSubscription,
    canAccessFeature,
    getUserFullName,
    getUserAvatar,
    isProfileComplete,
    getProfileCompletion,
    needsProfileCompletion,
    getUserRoleDisplay,
    isVerificationInProgress,
    getVerificationCountdown,
  };
};
