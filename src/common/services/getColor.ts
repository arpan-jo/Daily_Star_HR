import {COLORS} from '../constant/Themes';

/**
 * True when white text/icons stay legible on `hex`. Headers render their
 * content in white, so a brand color that fails this must not be used as a
 * header background. Accepts 3- or 6-digit hex.
 *
 * Threshold is WCAG AA for large text / UI components (3:1), not 4.5:1 — the
 * app's own primary #299647 measures 3.79:1, so a stricter bar would reject
 * the brand it is meant to match.
 */
const WHITE_CONTRAST_MIN = 3;

export const isDarkColor = (hex?: string | null): boolean => {
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex?.trim() || '');
  if (!match) {
    return false;
  }
  const digits =
    match[1].length === 3
      ? match[1].replace(/./g, d => d + d) // #abc -> #aabbcc
      : match[1];
  const int = parseInt(digits, 16);
  const [r, g, b] = [(int >> 16) & 255, (int >> 8) & 255, int & 255].map(v => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return 1.05 / (luminance + 0.05) >= WHITE_CONTRAST_MIN;
};

export const getStatusColor = (status: string | null | undefined) => {
  let modStatus = status?.toLowerCase();
  if (modStatus === 'pending') {
    return COLORS.yellow;
  }
  if (modStatus === 'approved' || modStatus === 'approve') {
    return '#229A16';
  }
  if (
    modStatus === 'process' ||
    modStatus === 'processing' ||
    modStatus === 'progress'
  ) {
    return '#D841F2';
  }
  if (modStatus === 'rejected' || modStatus === 'reject') {
    return '#FF696C';
  }
  if (modStatus === 'closed') {
    return COLORS.darkGray;
  }
};

export const getStatusBgColor = (status: string) => {
  let modStatus = status?.toLowerCase();
  if (modStatus === 'pending') {
    return '#FFF5D7';
  }
  if (modStatus === 'approved' || modStatus === 'approve') {
    return '#E4F8DD';
  }
  if (
    modStatus === 'process' ||
    modStatus === 'processing' ||
    modStatus === 'progress'
  ) {
    return '#F2E1F5';
  }
  if (modStatus === 'rejected' || modStatus === 'reject') {
    return '#FFE3E3';
  }
  if (modStatus === 'Closed') {
    return '#de2700';
  }
};

export const getAttendanceStatusColor = (status: string) => {
  let modStatus = status?.toLowerCase();
  if (modStatus === 'absent') {
    return '#D92D20';
  }
  if (modStatus === 'late') {
    return '#B54708';
  }
  if (modStatus === 'leave') {
    return '#BA24D5';
  }
  if (modStatus === 'movement') {
    return '#155EEF';
  }
  if (modStatus === 'holiday') {
    return '#4E5BA6';
  }
  if (modStatus === 'offday') {
    return '#667085';
  }
  if (modStatus === 'present') {
    return COLORS.primary;
  }
};

export const getAttendanceBgStatusColor = (status: string) => {
  let modStatus = status?.toLowerCase();
  if (modStatus === 'absent') {
    return '#FEE4E2';
  }
  if (modStatus === 'late') {
    return '#FEF0C7';
  }
  if (modStatus === 'leave') {
    return '#FBE8FF';
  }
  if (modStatus === 'movement') {
    return '#E5F3FF';
  }
  if (modStatus === 'holiday') {
    return '#EAECF5';
  }
  if (modStatus === 'offday') {
    return '#F2F4F7';
  }
  if (modStatus === 'present') {
    return COLORS.lightPrimary2;
  }
};

export const dividerColor = (status: string) => {
  let modStatus = status?.trim().toLowerCase();
  if (modStatus === 'financial') {
    return '#2ECC71';
  }
  if (modStatus === 'customer') {
    return '#3498DB';
  }
  if (modStatus?.includes('process')) {
    // api sends 'Internal Process'
    return '#E67E22';
  } else {
    return '#FF7F50';
  }
};

export const getMeetingStatusBgColor = (status: string) => {
  let modStatus = status?.toLowerCase();
  if (modStatus === 'upcoming') {
    return '#EAAA08';
  } else if (modStatus === 'draft save') {
    return '#667085';
  } else if (modStatus === 'inprogress') {
    return '#2E90FA';
  } else if (modStatus === 'completed') {
    return '#039855';
  } else if (modStatus === 'canceled') {
    return '#D92D20';
  } else if (modStatus === 'postponed') {
    return '#D444F1';
  } else if (modStatus === 'expired') {
    return 'gray';
  } else {
    return '#E6F9E9';
  }
};

export const getTodoMasterBgColor = (status: string) => {
  let modStatus = status?.toLowerCase()?.trim();
  if (modStatus === 'do first') {
    return '#039855';
  } else if (modStatus === 'schedule') {
    return '#0BA5EC';
  } else if (modStatus === 'delegate') {
    return '#EAAA08';
  } else if (modStatus === 'don’t do' || modStatus === "don't do") {
    return '#D92D20';
  } else {
    return '#E6F9E9';
  }
};

export const getBiddingStatusBgColor = (status: string) => {
  let modStatus = status?.toLowerCase();
  if (modStatus === 'applied') {
    return '#EAAA08';
  } else if (modStatus === 'win') {
    return '#039855';
  } else if (modStatus === 'lost') {
    return '#D92D20';
  } else if (modStatus === 'miss') {
    return '#767873';
  } else {
    return '#E6F9E9';
  }
};

export const getMeetingBgColor = (status: string) => {
  let modStatus = status?.toLowerCase()?.trim();
  if (modStatus === 'confirmed' || modStatus === 'accepted') {
    return COLORS.primary;
  } else if (modStatus === 'declined') {
    return COLORS.red;
  } else {
    return COLORS.yellow;
  }
};

export const getMeetingDiscussionBgColor = (status: string) => {
  let modStatus = status?.toLowerCase()?.trim();
  if (modStatus === 'allowed') {
    return COLORS.primary;
  } else if (modStatus === 'declined') {
    return COLORS.red;
  } else {
    return COLORS.yellow;
  }
};

export const getEmpProficiencyBgColor = (status: string) => {
  let modStatus = status?.toLowerCase();
  if (modStatus === 'beginner') {
    return '#FEF7C3';
  } else if (modStatus === 'intermediate') {
    return '#E0F2FE';
  } else if (modStatus === 'expert') {
    return '#D1FADF';
  } else {
    return '#E6F9E9';
  }
};

export const getEmpProficiencyTxtColor = (status: string) => {
  let modStatus = status?.toLowerCase();
  if (modStatus === 'beginner') {
    return '#713B12';
  } else if (modStatus === 'intermediate') {
    return '#026AA2';
  } else if (modStatus === 'expert') {
    return '#027A48';
  } else {
    return COLORS.primary;
  }
};
