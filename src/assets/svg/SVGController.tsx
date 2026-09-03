import React from 'react';
import HRCore from './HRCore.svg';
import MyTasks from './MyTasks.svg';
import MeetMap from './Meet-Map.svg';
import Culture from './Culture.svg';
import CRM from './CRM.svg';
import PeopleChat from './PeopleChat.svg';
import Procurement from './Procurement.svg';
import Opex from './OEE.svg';
import Sales from './Sales.svg';
import Inventory from './Inventory.svg';
import Transport from './Transport.svg';
import Wifi from './Wifi.svg';
import Customer from './Customer.svg';
import Farm from './Farm.svg';
import Marker from './map_pin.svg';
import Visitor from './Visitor.svg';
import {StyleSheet, View} from 'react-native';
import {COLORS} from '../../common/constant/Themes';

interface ContainerProps {
  name: string;
  SVGheight?: number;
  SVGwidth?: number;
}

const SVGController: React.FC<ContainerProps> = ({
  name,
  SVGheight = 48,
  SVGwidth = 48,
}) => {
  const getSVGImage = (svgName: string, width: number, height: number): any => {
    switch (svgName) {
      case 'HR Core':
        return <HRCore width={width} height={height} />;
      case 'My Tasks':
        return <MyTasks width={width} height={height} />;
      case 'Meet-Map':
        return <MeetMap width={width} height={height} />;
      case 'Culture':
        return <Culture width={width} height={height} />;
      case 'CRM':
        return <CRM width={width} height={height} />;
      case 'PeopleChat':
        return <PeopleChat width={width} height={height} />;
      case 'Procurement':
        return <Procurement width={width} height={height} />;
      case 'Sales':
        return <Sales width={width} height={height} />;
      case 'Inventory':
        return <Inventory width={width} height={height} />;
      case 'OPEX':
        return <Opex width={width} height={height} />;
      case 'Transport':
        return <Transport width={width} height={height} />;
      case 'Wifi Zone Setup':
        return <Wifi width={width} height={height} />;
      case 'Social Engagement':
        return <Customer width={width} height={height} />;
      case 'Poultry & Cattle':
        return <Farm width={width} height={height} />;
      case 'Marker':
        return <Marker width={width} height={height} />;
      case 'Visitor':
        return <Visitor width={width} height={height} />;
      default:
        return <HRCore width={width} height={height} />;
    }
  };
  return (
    <View style={styles.container}>
      {getSVGImage(name, SVGwidth, SVGheight)}
    </View>
  );
};

export default SVGController;

const styles = StyleSheet.create({
  container: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.newGray,
    borderRadius: 100,
  },
});
