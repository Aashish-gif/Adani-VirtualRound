// MongoDB Dummy Data Import Script
// Run this script with: node seed-database.js

import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import MaintenanceTeam from './models/MaintenanceTeam.js';
import Equipment from './models/Equipment.js';
import MaintenanceRequest from './models/MaintenanceRequest.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gearguard';

const teams = [
  {
    _id: new mongoose.Types.ObjectId('676f00000000000000000001'),
    name: "Electrical Systems Team",
    description: "Responsible for all electrical equipment maintenance and repairs",
    leaderId: null,
    members: [],
  },
  {
    _id: new mongoose.Types.ObjectId('676f00000000000000000002'),
    name: "Mechanical Systems Team",
    description: "Handles all mechanical equipment including pumps, motors, and conveyor systems",
    leaderId: null,
    members: [],
  },
  {
    _id: new mongoose.Types.ObjectId('676f00000000000000000003'),
    name: "HVAC & Refrigeration Team",
    description: "Specializes in heating, ventilation, air conditioning, and refrigeration systems",
    leaderId: null,
    members: [],
  },
  {
    _id: new mongoose.Types.ObjectId('676f00000000000000000004'),
    name: "Hydraulic Systems Team",
    description: "Maintains hydraulic presses, lifts, and related equipment",
    leaderId: null,
    members: [],
  }
];

const equipment = [
  {
    _id: new mongoose.Types.ObjectId('676e00000000000000000001'),
    name: "CNC Machine #1",
    serialNumber: "CNC-2024-001",
    department: "Production",
    maintenanceTeamId: new mongoose.Types.ObjectId('676f00000000000000000002'),
    purchaseDate: new Date('2022-03-15'),
    warrantyExpiry: new Date('2025-03-15'),
    location: "Manufacturing Floor A, Bay 3",
    isScrapped: false,
  },
  {
    _id: new mongoose.Types.ObjectId('676e00000000000000000002'),
    name: "Hydraulic Press #2",
    serialNumber: "HP-2024-002",
    department: "Production",
    maintenanceTeamId: new mongoose.Types.ObjectId('676f00000000000000000004'),
    purchaseDate: new Date('2021-07-22'),
    warrantyExpiry: new Date('2024-07-22'),
    location: "Manufacturing Floor B, Station 5",
    isScrapped: false,
  },
  {
    _id: new mongoose.Types.ObjectId('676e00000000000000000003'),
    name: "Industrial Chiller Unit",
    serialNumber: "ICU-2024-003",
    department: "Facilities",
    maintenanceTeamId: new mongoose.Types.ObjectId('676f00000000000000000003'),
    purchaseDate: new Date('2020-11-10'),
    warrantyExpiry: new Date('2023-11-10'),
    location: "Building C, Roof Level",
    isScrapped: false,
  },
  {
    _id: new mongoose.Types.ObjectId('676e00000000000000000004'),
    name: "Conveyor Belt System A",
    serialNumber: "CBS-2024-004",
    department: "Warehouse",
    maintenanceTeamId: new mongoose.Types.ObjectId('676f00000000000000000002'),
    purchaseDate: new Date('2023-01-18'),
    warrantyExpiry: new Date('2026-01-18'),
    location: "Warehouse Dock 1",
    isScrapped: false,
  },
  {
    _id: new mongoose.Types.ObjectId('676e00000000000000000005'),
    name: "Backup Generator",
    serialNumber: "GEN-2024-005",
    department: "Facilities",
    maintenanceTeamId: new mongoose.Types.ObjectId('676f00000000000000000001'),
    purchaseDate: new Date('2019-06-05'),
    warrantyExpiry: new Date('2022-06-05'),
    location: "Building A, Basement",
    isScrapped: false,
  },
  {
    _id: new mongoose.Types.ObjectId('676e00000000000000000006'),
    name: "Air Compressor Unit #3",
    serialNumber: "ACU-2024-006",
    department: "Production",
    maintenanceTeamId: new mongoose.Types.ObjectId('676f00000000000000000002'),
    purchaseDate: new Date('2022-09-12'),
    warrantyExpiry: new Date('2025-09-12'),
    location: "Compressor Room, Level 2",
    isScrapped: false,
  },
  {
    _id: new mongoose.Types.ObjectId('676e00000000000000000007'),
    name: "Forklift Model FL-200",
    serialNumber: "FL-2024-007",
    department: "Warehouse",
    maintenanceTeamId: new mongoose.Types.ObjectId('676f00000000000000000002'),
    purchaseDate: new Date('2023-04-20'),
    warrantyExpiry: new Date('2026-04-20'),
    location: "Warehouse Main Area",
    isScrapped: false,
  },
  {
    _id: new mongoose.Types.ObjectId('676e00000000000000000008'),
    name: "Laser Cutting Machine",
    serialNumber: "LCM-2024-008",
    department: "Production",
    maintenanceTeamId: new mongoose.Types.ObjectId('676f00000000000000000002'),
    purchaseDate: new Date('2024-02-14'),
    warrantyExpiry: new Date('2027-02-14'),
    location: "Manufacturing Floor A, Bay 7",
    isScrapped: false,
  },
  {
    _id: new mongoose.Types.ObjectId('676e00000000000000000009'),
    name: "Water Pump Station",
    serialNumber: "WPS-2024-009",
    department: "Facilities",
    maintenanceTeamId: new mongoose.Types.ObjectId('676f00000000000000000004'),
    purchaseDate: new Date('2018-12-01'),
    warrantyExpiry: new Date('2021-12-01'),
    location: "Underground Utility Room",
    isScrapped: false,
  },
  {
    _id: new mongoose.Types.ObjectId('676e00000000000000000010'),
    name: "Old Printing Press",
    serialNumber: "PP-2024-010",
    department: "Production",
    purchaseDate: new Date('2010-05-20'),
    warrantyExpiry: new Date('2013-05-20'),
    location: "Storage Yard",
    isScrapped: true,
  },
  {
    _id: new mongoose.Types.ObjectId('676e00000000000000000011'),
    name: "Welding Robot Arm #5",
    serialNumber: "WRA-2024-011",
    department: "Production",
    maintenanceTeamId: new mongoose.Types.ObjectId('676f00000000000000000001'),
    purchaseDate: new Date('2023-08-10'),
    warrantyExpiry: new Date('2026-08-10'),
    location: "Assembly Line 2, Station 8",
    isScrapped: false,
  },
  {
    _id: new mongoose.Types.ObjectId('676e00000000000000000012'),
    name: "HVAC Unit - Building B",
    serialNumber: "HVAC-2024-012",
    department: "Facilities",
    maintenanceTeamId: new mongoose.Types.ObjectId('676f00000000000000000003'),
    purchaseDate: new Date('2021-03-25'),
    warrantyExpiry: new Date('2024-03-25'),
    location: "Building B, Mechanical Room",
    isScrapped: false,
  }
];

const requests = [
  {
    _id: new mongoose.Types.ObjectId('676d00000000000000000001'),
    type: "preventive",
    subject: "Quarterly Preventive Maintenance - CNC Machine",
    equipmentId: new mongoose.Types.ObjectId('676e00000000000000000001'),
    maintenanceTeamId: new mongoose.Types.ObjectId('676f00000000000000000002'),
    status: "new",
    scheduledDate: new Date('2025-01-15T09:00:00.000Z'),
    durationHours: 4,
    isOverdue: false,
    // Note: createdBy will need to be updated with actual user ObjectId after you create users
    createdBy: new mongoose.Types.ObjectId('000000000000000000000001'), // Placeholder
  },
  {
    _id: new mongoose.Types.ObjectId('676d00000000000000000002'),
    type: "corrective",
    subject: "Hydraulic Press Oil Leak Repair",
    equipmentId: new mongoose.Types.ObjectId('676e00000000000000000002'),
    maintenanceTeamId: new mongoose.Types.ObjectId('676f00000000000000000004'),
    status: "in-progress",
    scheduledDate: new Date('2024-12-28T08:00:00.000Z'),
    durationHours: 6,
    isOverdue: false,
    createdBy: new mongoose.Types.ObjectId('000000000000000000000001'),
  },
  {
    _id: new mongoose.Types.ObjectId('676d00000000000000000003'),
    type: "preventive",
    subject: "Annual Chiller Filter Replacement",
    equipmentId: new mongoose.Types.ObjectId('676e00000000000000000003'),
    maintenanceTeamId: new mongoose.Types.ObjectId('676f00000000000000000003'),
    status: "repaired",
    scheduledDate: new Date('2024-12-10T10:00:00.000Z'),
    durationHours: 3,
    isOverdue: false,
    createdBy: new mongoose.Types.ObjectId('000000000000000000000001'),
  },
  {
    _id: new mongoose.Types.ObjectId('676d00000000000000000004'),
    type: "corrective",
    subject: "Conveyor Belt Alignment Issue",
    equipmentId: new mongoose.Types.ObjectId('676e00000000000000000004'),
    maintenanceTeamId: new mongoose.Types.ObjectId('676f00000000000000000002'),
    status: "new",
    scheduledDate: new Date('2024-12-29T13:00:00.000Z'),
    durationHours: 2,
    isOverdue: false,
    createdBy: new mongoose.Types.ObjectId('000000000000000000000001'),
  },
  {
    _id: new mongoose.Types.ObjectId('676d00000000000000000005'),
    type: "preventive",
    subject: "Generator Monthly Load Testing",
    equipmentId: new mongoose.Types.ObjectId('676e00000000000000000005'),
    maintenanceTeamId: new mongoose.Types.ObjectId('676f00000000000000000001'),
    status: "in-progress",
    scheduledDate: new Date('2024-12-27T14:00:00.000Z'),
    durationHours: 2,
    isOverdue: false,
    createdBy: new mongoose.Types.ObjectId('000000000000000000000001'),
  },
  {
    _id: new mongoose.Types.ObjectId('676d00000000000000000006'),
    type: "preventive",
    subject: "Air Compressor Oil Change",
    equipmentId: new mongoose.Types.ObjectId('676e00000000000000000006'),
    maintenanceTeamId: new mongoose.Types.ObjectId('676f00000000000000000002'),
    status: "new",
    scheduledDate: new Date('2025-01-05T11:00:00.000Z'),
    durationHours: 1,
    isOverdue: false,
    createdBy: new mongoose.Types.ObjectId('000000000000000000000001'),
  },
  {
    _id: new mongoose.Types.ObjectId('676d00000000000000000007'),
    type: "corrective",
    subject: "Forklift Brake System Failure",
    equipmentId: new mongoose.Types.ObjectId('676e00000000000000000007'),
    maintenanceTeamId: new mongoose.Types.ObjectId('676f00000000000000000002'),
    status: "new",
    scheduledDate: new Date('2024-12-24T08:00:00.000Z'),
    durationHours: 5,
    isOverdue: true,
    createdBy: new mongoose.Types.ObjectId('000000000000000000000001'),
  },
  {
    _id: new mongoose.Types.ObjectId('676d00000000000000000008'),
    type: "preventive",
    subject: "Laser Cutting Machine Lens Cleaning",
    equipmentId: new mongoose.Types.ObjectId('676e00000000000000000008'),
    maintenanceTeamId: new mongoose.Types.ObjectId('676f00000000000000000002'),
    status: "repaired",
    scheduledDate: new Date('2024-12-22T15:00:00.000Z'),
    durationHours: 2,
    isOverdue: false,
    createdBy: new mongoose.Types.ObjectId('000000000000000000000001'),
  },
  {
    _id: new mongoose.Types.ObjectId('676d00000000000000000009'),
    type: "corrective",
    subject: "Water Pump Pressure Sensor Malfunction",
    equipmentId: new mongoose.Types.ObjectId('676e00000000000000000009'),
    maintenanceTeamId: new mongoose.Types.ObjectId('676f00000000000000000004'),
    status: "in-progress",
    scheduledDate: new Date('2024-12-26T10:00:00.000Z'),
    durationHours: 3,
    isOverdue: true,
    createdBy: new mongoose.Types.ObjectId('000000000000000000000001'),
  },
  {
    _id: new mongoose.Types.ObjectId('676d00000000000000000010'),
    type: "corrective",
    subject: "Old Printing Press - Final Inspection",
    equipmentId: new mongoose.Types.ObjectId('676e00000000000000000010'),
    status: "scrap",
    scheduledDate: new Date('2024-12-05T09:00:00.000Z'),
    durationHours: 1,
    isOverdue: false,
    createdBy: new mongoose.Types.ObjectId('000000000000000000000001'),
  },
  {
    _id: new mongoose.Types.ObjectId('676d00000000000000000011'),
    type: "preventive",
    subject: "Welding Robot Calibration Check",
    equipmentId: new mongoose.Types.ObjectId('676e00000000000000000011'),
    maintenanceTeamId: new mongoose.Types.ObjectId('676f00000000000000000001'),
    status: "new",
    scheduledDate: new Date('2025-01-10T08:30:00.000Z'),
    durationHours: 3,
    isOverdue: false,
    createdBy: new mongoose.Types.ObjectId('000000000000000000000001'),
  },
  {
    _id: new mongoose.Types.ObjectId('676d00000000000000000012'),
    type: "preventive",
    subject: "HVAC Filter Replacement - Building B",
    equipmentId: new mongoose.Types.ObjectId('676e00000000000000000012'),
    maintenanceTeamId: new mongoose.Types.ObjectId('676f00000000000000000003'),
    status: "repaired",
    scheduledDate: new Date('2024-12-18T12:00:00.000Z'),
    durationHours: 2,
    isOverdue: false,
    createdBy: new mongoose.Types.ObjectId('000000000000000000000001'),
  },
  {
    _id: new mongoose.Types.ObjectId('676d00000000000000000013'),
    type: "corrective",
    subject: "CNC Machine Spindle Noise Investigation",
    equipmentId: new mongoose.Types.ObjectId('676e00000000000000000001'),
    maintenanceTeamId: new mongoose.Types.ObjectId('676f00000000000000000002'),
    status: "new",
    scheduledDate: new Date('2025-01-02T10:00:00.000Z'),
    durationHours: 4,
    isOverdue: false,
    createdBy: new mongoose.Types.ObjectId('000000000000000000000001'),
  },
  {
    _id: new mongoose.Types.ObjectId('676d00000000000000000014'),
    type: "preventive",
    subject: "Hydraulic Press Safety Inspection",
    equipmentId: new mongoose.Types.ObjectId('676e00000000000000000002'),
    maintenanceTeamId: new mongoose.Types.ObjectId('676f00000000000000000004'),
    status: "new",
    scheduledDate: new Date('2025-01-20T09:00:00.000Z'),
    durationHours: 3,
    isOverdue: false,
    createdBy: new mongoose.Types.ObjectId('000000000000000000000001'),
  },
  {
    _id: new mongoose.Types.ObjectId('676d00000000000000000015'),
    type: "corrective",
    subject: "Conveyor Belt Motor Overheating",
    equipmentId: new mongoose.Types.ObjectId('676e00000000000000000004'),
    maintenanceTeamId: new mongoose.Types.ObjectId('676f00000000000000000002'),
    status: "in-progress",
    scheduledDate: new Date('2024-12-20T14:00:00.000Z'),
    durationHours: 4,
    isOverdue: true,
    createdBy: new mongoose.Types.ObjectId('000000000000000000000001'),
  }
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully!\n');

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('Clearing existing data...');
    await MaintenanceTeam.deleteMany({});
    await Equipment.deleteMany({});
    await MaintenanceRequest.deleteMany({});
    console.log('Cleared!\n');

    // Insert teams
    console.log('Inserting maintenance teams...');
    await MaintenanceTeam.insertMany(teams);
    console.log(`✓ Inserted ${teams.length} teams\n`);

    // Insert equipment
    console.log('Inserting equipment...');
    await Equipment.insertMany(equipment);
    console.log(`✓ Inserted ${equipment.length} equipment items\n`);

    // Insert maintenance requests
    console.log('Inserting maintenance requests...');
    await MaintenanceRequest.insertMany(requests);
    console.log(`✓ Inserted ${requests.length} maintenance requests\n`);

    console.log('🎉 Database seeded successfully!');
    console.log('\n⚠️  IMPORTANT: Update the createdBy field in maintenance requests');
    console.log('   with actual user ObjectIds after creating users via the admin panel.\n');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedDatabase();
