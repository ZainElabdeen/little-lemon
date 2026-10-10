export const STORAGE_KEYS = {
  onboardingCompleted: "onboardingCompleted",
  firstName: "firstName",
  lastName: "lastName",
  email: "email",
  phoneNumber: "phoneNumber",
  avatarUri: "avatarUri",
  notifications: "notifications",
} as const;

export type NotificationPreferences = {
  orderStatuses: boolean;
  passwordChanges: boolean;
  specialOffers: boolean;
  newsletter: boolean;
};

export const NOTIFICATION_LABELS: {
  key: keyof NotificationPreferences;
  label: string;
}[] = [
  { key: "orderStatuses", label: "Order statuses" },
  { key: "passwordChanges", label: "Password changes" },
  { key: "specialOffers", label: "Special offers" },
  { key: "newsletter", label: "Newsletter" },
];

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  orderStatuses: true,
  passwordChanges: true,
  specialOffers: true,
  newsletter: true,
};
