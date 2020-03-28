'use strict';
class ReservationSchema {
    getSchema(DataTypes) {
        return {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV1
            },
            make: {
                type: DataTypes.STRING,
            },
            model: {
                type: DataTypes.STRING,
            },
            year: {
                type: DataTypes.INTEGER,
            },
            registration: {
                type: DataTypes.STRING,
            },
            condition: {
                type: DataTypes.STRING,
            },
            instruction: {
                type: DataTypes.STRING,
            },
            seats: {
                type: DataTypes.INTEGER,
            },
            door: {
                type: DataTypes.INTEGER,
                defaultValue: 4
            },
            builtInGPS: {
                type: DataTypes.INTEGER,
                field: 'built-in-gps', 
                defaultValue: 0 // 1 = yes, 0 = no
            },
            fuel: {
                type: DataTypes.INTEGER,
                defaultValue: 1 // 1 = petrol, 2 = diesel
            },
            bluetooth: {
                type: DataTypes.INTEGER,
                defaultValue: 0 //1 got bluetooth and 0 no bluetooth
            },
            lock: {
                type: DataTypes.INTEGER,
                defaultValue: 0 //0 = key , 1 =keyless
            },
            transmission: {
                type: DataTypes.INTEGER,
                defaultValue: 0 //0 =automatic , 1=manual\'' AFTER `lock`;
            },
            childSeat: {
                type: DataTypes.INTEGER,
                field: 'child_seat'
            },
            buildingId: {
                type: DataTypes.UUID,
                 field: 'building_id'
            },
            photo: {
                type: DataTypes.STRING,
            },
            photoDir: {
                type: DataTypes.STRING,
                field: 'photo_dir'
            },
            costPeak: {
                type: DataTypes.FLOAT,
                field: 'cost_peak'
            },
            costPeakMobile: {
                type: DataTypes.FLOAT,
                field: 'cost_peak_mobile'
            },
            costOffpeak: {
                type: DataTypes.FLOAT,
                field: 'cost_offpeak'
            },
            costOffpeakMobile: {
                type: DataTypes.FLOAT,
                field: 'cost_offpeak_mobile'
            },
            peakTimeStart: {
                type: DataTypes.INTEGER,
                field: 'peak_time_start'
            },
            peakTimeEnd: {
                type: DataTypes.INTEGER,
                field: 'peak_time_end'
            },
            dayRate: {
                type: DataTypes.FLOAT,
                field: 'day_rate'
            },
            monthlyRate: {
                type: DataTypes.FLOAT,
                field: 'monthly_rate'
            },
            dayRateMobile: {
                type: DataTypes.FLOAT,
                field: 'day_rate_mobile'
            },
            allowRangeHour: {
                type: DataTypes.INTEGER,
                field: 'allow_range_hour'
            },
            allowRangeDay: {
                type: DataTypes.INTEGER,
                field: 'allow_range_day'
            },
            remoteLock: {
                type: DataTypes.INTEGER,
                field: 'remote_lock'
            },
            unlockType: {
                type: DataTypes.INTEGER,
            },
            trackerId: {
                type: DataTypes.STRING,
                field: 'tracker_id'
            },
            bluetoothAddress: {
                type: DataTypes.STRING,
                field: 'bluetooth_address'
            },
            bluetoothService: {
                type: DataTypes.STRING,
                field: 'bluetooth_service'
            },
            bluetoothCharacteristic: {
                type: DataTypes.STRING,
                field: 'bluetooth_characteristic'
            },
            remoteSimNumber: {
                type: DataTypes.STRING,
                field: 'remote_sim_number'
            },
            remoteUnlockTemplate: {
                type: DataTypes.STRING,
                field: 'remote_unlock_template'
            },
            remoteLockTemplate: {
                type: DataTypes.STRING,
                field: 'remote_lock_template'
            },
            minBookingAllow: {
                type: DataTypes.INTEGER,
            },
            status: {
                type: DataTypes.INTEGER,
            },
            deployedDate: {
                type: DataTypes.DATE,
                field: 'deployed_date'
            },
            tags: {
                type: DataTypes.STRING,
            },
            owner: {
                type: DataTypes.STRING,
            },
            available: {
                type: DataTypes.INTEGER,
            },
            carTypeId: {
                type: DataTypes.UUID,
                field: 'carType_id'
            },
            usage: {
                type: DataTypes.INTEGER,
            },
            created: {
                type: DataTypes.DATE,
            },
            blockId: {
                type: DataTypes.UUID,
                 field: 'block_id'
            },
            odometer: {
                type: DataTypes.INTEGER,
            },
        };
    }
}
module.exports = new ReservationSchema();