import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {COLORS} from '../../../common/constant/Themes';

// Types
interface StatusBadgeProps {
  status?: string;
  type?: 'default' | 'live' | 'pending';
}

interface OrganizationIndicatorProps {
  organizationId?: number;
  type?: string;
}

interface QuantityInfoProps {
  label: string;
  value: string | number;
  onPress?: () => void;
  showInfo?: boolean;
}

interface ProcurementCardProps {
  // Header props
  createdDate?: string;
  title: string;
  subtitle?: string;
  status?: string;
  statusType?: 'default' | 'live' | 'pending';

  // Organization/Type indicator
  organizationId?: number;
  organizationType?: string;

  // Main content
  code?: string;
  amount?: string;
  currency?: string;
  businessPartner?: string;
  plant?: string;
  warehouse?: string;
  reference?: string;
  createdBy?: string;
  // Additional info
  additionalInfo?: React.ReactNode;

  // Quantity information
  quantities?: QuantityInfoProps[];

  // Actions
  onPress?: () => void;
  onLongPress?: () => void;

  // Styling
  style?: ViewStyle;
}

// Status Badge Component
const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  type = 'default',
}) => {
  const getStatusColor = (status: string, _type: string) => {
    switch (status) {
      case 'Approved':
        return COLORS.primary;
      case 'Pending':
        return COLORS.yellow;
      case 'Declined':
        return '#767873';
      case 'Rejected':
        return '#EF4444';
      case 'Live':
        return COLORS.absent;
      case 'Prepared':
        return COLORS.maroon;
      case 'Upcoming':
        return COLORS.late;
      case 'Closed':
        return COLORS.darkGray;
      case 'Approved':
        return COLORS.primary;
      default:
        return '#6B7280';
    }
  };

  return (
    <View
      style={[
        styles.statusBadge,
        {backgroundColor: getStatusColor(status, type)},
      ]}>
      <Text style={styles.statusText}>{status}</Text>
    </View>
  );
};

// Organization Indicator Component
const OrganizationIndicator: React.FC<OrganizationIndicatorProps> = ({
  organizationId,
  type,
}) => {
  const getIconAndLabel = () => {
    if (type) {
      switch (type.toLowerCase()) {
        case 'local':
        case 'local order':
          return {
            icon: 'truck-outline',
            label: 'Local Order',
            iconType: 'material-community',
          };
        case 'foreign':
        case 'foreign order':
          return {
            icon: 'airplane',
            label: 'Foreign Order',
            iconType: 'material-community',
          };
        case 'fabrication':
          return {
            icon: 'precision-manufacturing',
            label: 'Fabrication',
            iconType: 'material',
          };
        default:
          return null;
      }
    }

    if (organizationId === 11) {
      return {
        icon: 'truck-outline',
        label: 'Local Order',
        iconType: 'material-community',
      };
    } else if (organizationId === 12) {
      return {
        icon: 'airplane',
        label: 'Foreign Order',
        iconType: 'material-community',
      };
    } else {
      return {
        icon: 'precision-manufacturing',
        label: 'Fabrication',
        iconType: 'material',
      };
    }
  };

  const iconData = getIconAndLabel();
  if (!iconData) return null;

  return (
    <View style={styles.organizationIndicator}>
      {iconData.iconType === 'material-community' ? (
        <MIcon
          name={iconData.icon}
          color={COLORS.textNewColor}
          size={15}
          style={styles.organizationIcon}
        />
      ) : (
        <Icon
          name={iconData.icon}
          color={COLORS.textNewColor}
          size={15}
          style={styles.organizationIcon}
        />
      )}
      <Text style={styles.organizationText}>{iconData.label}</Text>
    </View>
  );
};

// Quantity Info Component
const QuantityInfo: React.FC<QuantityInfoProps> = ({
  label,
  value,
  onPress,
  showInfo = false,
}) => {
  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component style={styles.quantityWrapper} onPress={onPress}>
      <View style={styles.quantityContent}>
        {showInfo && (
          <MIcon name="information-outline" style={styles.infoIcon} />
        )}
        <Text
          style={[
            {...styles.quantityText},
            label === 'Rec Qty' && {
              marginLeft: 6,
              color: '#0086C9',
              fontWeight: '500',
              fontSize: 12,
              textDecorationLine: 'underline',
            },
          ]}>
          {label} {value}
        </Text>
      </View>
    </Component>
  );
};

// Main Card Component
const ProcurementCard: React.FC<ProcurementCardProps> = ({
  createdDate,
  title,
  subtitle,
  status,
  statusType = 'default',
  organizationId,
  organizationType,
  code,
  amount,
  currency,
  businessPartner,
  plant,
  warehouse,
  reference: _reference,
  createdBy,
  additionalInfo,
  quantities = [],
  onPress,
  onLongPress,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      onLongPress={onLongPress}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <Text style={styles.dateText}>{createdDate || ''}</Text>
        {organizationId && (
          <>
            <Ionicons name="ellipse" style={styles.ellipse} />
            <OrganizationIndicator
              organizationId={organizationId}
              type={organizationType}
            />
          </>
        )}
        <StatusBadge status={status} type={statusType} />
      </View>
      {/* Code and Amount Row */}
      {(code || amount) && (
        <View style={styles.codeAmountRow}>
          {code && <Text style={styles.codeText}>{code}</Text>}
          {code && amount && <Ionicons name="ellipse" style={styles.ellipse} />}
          {amount && (
            <Text style={styles.amountText}>
              Net {currency || 'BDT'} {amount}
            </Text>
          )}
        </View>
      )}
      {/* Title */}
      {title && <Text style={styles.title}>{title}</Text>}
      {/* Subtitle */}
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {/* Business Partner */}
      {businessPartner && (
        <Text style={styles.businessPartner}>{businessPartner}</Text>
      )}
      {/* Plant and Warehouse */}
      {(plant || warehouse) && (
        <Text style={styles.plantWarehouse}>
          {plant && `Plant: ${plant}`}
          {plant && warehouse && ', '}
          {warehouse && `Warehouse: ${warehouse}`}
        </Text>
      )}

      {/* Additional Info */}
      {additionalInfo && additionalInfo}
      {/* Quantities Row */}
      {quantities.length > 0 && (
        <View style={styles.quantitiesRow}>
          {quantities.map((quantity, index) => (
            <QuantityInfo
              key={index}
              label={quantity.label}
              value={quantity.value}
              onPress={quantity.onPress}
              showInfo={quantity.showInfo}
            />
          ))}
        </View>
      )}

      {/* Created By */}
      {createdBy && <Text style={styles.reference}> {createdBy}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    //  marginBottom: 8,
  },
  dateText: {
    fontSize: 12,
    color: COLORS.textNewColor,
  },
  ellipse: {
    fontSize: 6,
    color: COLORS.textNewColor,
    marginHorizontal: 8,
  },
  organizationIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  organizationIcon: {
    marginRight: 4,
  },
  organizationText: {
    fontSize: 12,
    color: COLORS.black,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.white,
  },
  codeAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  codeText: {
    fontSize: 14,
    color: COLORS.textNewColor,
    fontWeight: '600',
  },
  amountText: {
    fontSize: 14,
    color: '#101828',
    fontWeight: '400',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textNewColor,
    lineHeight: 20,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textNewColor,
  },
  businessPartner: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.black,
    lineHeight: 20,
  },
  plantWarehouse: {
    fontSize: 12,
    color: COLORS.textNewColor,
  },
  reference: {
    fontSize: 12,
    color: COLORS.textNewColor,
  },
  additionalInfo: {
    fontSize: 12,
    color: COLORS.textNewColor,
  },
  quantitiesRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  quantityWrapper: {
    backgroundColor: COLORS.newGray,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  quantityContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 12,
    color: COLORS.textNewColor,
  },
  infoIcon: {
    fontSize: 16,
    color: '#0086C9',
    left: 4,
  },
});

export default ProcurementCard;
