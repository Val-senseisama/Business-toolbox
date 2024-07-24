import { DateTime } from "luxon";
import { SaveAuditTrail, ThrowError } from "../../Helpers/Helpers.js";
import { DBObject } from "../../Helpers/MySQL.js";
import { Validate } from "../../Helpers/Validate.js";
import hasPermission from "../../Helpers/hasPermission.js";
import _CONFIG from "../../config/config.js";

export default {
  Query: {
    async getEmployeeAttendance(_, { company_id, employee_id, attendance_date_start, attendance_date_end }, context) {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }

      if (!hasPermission({ context, company_id, tasks: ['manage_hr', 'manage_attendance'] })) {
        ThrowError('#NOACCESS');
      }
      if (!Validate.positiveInteger(company_id) || !Validate.positiveInteger(employee_id)) {
        ThrowError("Invalid company or employee.");
      }
      if (!Validate.date(attendance_date_start) || !Validate.date(attendance_date_start)) {
        ThrowError("Invalid start or end date.");
      }
      // check if start date is greater than end date
      if (new Date(attendance_date_start) > new Date(attendance_date_end)) {
        ThrowError("Start date cannot be greater than end date.");
      }

      const query = `SELECT * FROM hr_attendance WHERE company_id = :company_id
          AND employee_id = :employee_id AND attendance_date BETWEEN :start AND :end`;
      const params = { company_id, employee_id, start: attendance_date_start, end: attendance_date_end };
      try {
        const results = await DBObject.findDirect(query, params);
        return results;
      } catch (error) {
        ThrowError("Error fetching employee attendance.");
      }
    },

    async getAllEmployeeAttendance(_, { company_id, attendance_date_start, attendance_date_end }, context) {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }

      if (!hasPermission({ context, company_id, tasks: ['manage_hr', 'manage_attendance'] })) {
        ThrowError('#NOACCESS');
      }
      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid company.");
      }

      if (!Validate.date(attendance_date_start) || !Validate.date(attendance_date_start)) {
        ThrowError("Invalid start or end date.");
      }
      // check if start date is greater than end date
      if (new Date(attendance_date_start) > new Date(attendance_date_end)) {
        ThrowError("Start date cannot be greater than end date.");
      }
      const query = `SELECT * FROM hr_attendance WHERE company_id = :company_id
          AND attendance_date BETWEEN :start AND :end`;
      const params = { company_id, start: attendance_date_start, end: attendance_date_end };
      try {
        const results = await DBObject.findDirect(query, params);
        return results;
      } catch (error) {
        ThrowError("Error fetching all employee attendance.");
      }
    },
  },

  Mutation: {
    async checkEmployeeIn(_, { company_id, employee_id }, context) {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }

      if (!hasPermission({ context, company_id, tasks: ['manage_hr', 'manage_attendance'] })) {
        ThrowError('#NOACCESS');
      }

      if (!Validate.positiveInteger(company_id) || !Validate.positiveInteger(employee_id)) {
        ThrowError("Invalid company or employee.");
      }

      const checkInTime = new Date().toISOString().split('T')[1].slice(0, 5);
      const data = { attendance_date: DateTime.now().toSQLDate(), check_in: checkInTime, created_by: context.name };

      try {
        const attendanceId = await DBObject.insertOne('hr_attendance', { company_id, employee_id, attendance_date: DateTime.now().toSQLDate(), check_in: checkInTime, created_by: context.name });
        if (!Validate.positiveInteger(attendanceId)) {
          ThrowError("Error recording check-in.");
        }
        SaveAuditTrail({
          user_id: context.id,
          name: context.name,
          company_id,
          task: "CHECK_IN",
          details: `${context.name} checked in employee ${employee_id} on ${data.attendance_date} by ${checkInTime}`,
        });
        
        return attendanceId;
      } catch (error) {
        ;
        ThrowError("Error recording check-in.");
      }
    },

    async checkEmployeeOut(_, { company_id, employee_id }, context) {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }

      if (!hasPermission({ context, company_id, tasks: ['manage_hr', 'manage_attendance'] })) {
        ThrowError('#NOACCESS');
      }

      if (!Validate.positiveInteger(company_id) || !Validate.positiveInteger(employee_id)) {
        ThrowError("Invalid company or employee.");
      }

      const checkOutTime = new Date().toISOString().split('T')[1].slice(0, 5);
      try {
        const updatedCount = await DBObject.updateOne('hr_attendance', { check_out: checkOutTime }, { company_id, employee_id, attendance_date: new Date().toISOString().split('T')[0] });
        if (updatedCount === 0) {
          ThrowError("Attendance record not found or already checked out.");
        }
        SaveAuditTrail({
          user_id: context.id,
          name: context.name,
          company_id,
          task: "CHECK_OUT",
          details: `${context.name} checked out employee ${employee_id} at ${checkOutTime}`,
        });
        return updatedCount;
      } catch (error) {
        ;
        ThrowError("Error recording check-out.");
      }
    },

    async updateEmployeeAttendance(_, { company_id, employee_id, attendance_date, check_in, check_out }, context) {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }

      if (!hasPermission({ context, company_id, tasks: ['manage_hr', 'manage_attendance'] })) {
        ThrowError('#NOACCESS');
      }

      if (!Validate.positiveInteger(company_id) || !Validate.positiveInteger(employee_id)) {
        ThrowError("Invalid company or employee.");
      }

      if (!Validate.time(check_in) || !Validate.time(check_out)) {
        ThrowError("Invalid check-in or check-out time.");
      }

      if (!Validate.date(attendance_date)) {
        ThrowError("Invalid attendance date.");
      }

      const data = { check_in, check_out };
      try {
        const updatedCount = await DBObject.updateOne('hr_attendance', data, { company_id, employee_id, attendance_date });
        SaveAuditTrail({
          user_id: context.id,
          name: context.name,
          company_id,
          task: "UPDATE_ATTENDANCE",
          details: `Updated attendance for employee ${employee_id} on ${attendance_date} to ${check_in} - ${check_out}`,
        });
        return updatedCount;
      } catch (error) {
        ;
        ThrowError("Error updating attendance.");
      }
    },

    async updateMultipleEmployeeAttendance(_, { company_id, employee_ids, attendance_date, check_in, check_out }, context) {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }


      if (!hasPermission({ context, company_id, tasks: ['manage_hr', 'manage_attendance'] })) {
        ThrowError('#NOACCESS');
      }

      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid company.");
      }
      if (!Validate.array(employee_ids)) {
        ThrowError("Invalid employees.");
      }

      if (!Validate.time(check_in) || !Validate.time(check_out)) {
        ThrowError("Invalid check-in or check-out time.");
      }

      if (!Validate.date(attendance_date)) {
        ThrowError("Invalid attendance date.");
      }

      const data = { check_in, check_out };

      await DBObject.transaction();
      for (const employee_id of employee_ids) {
        const condition = { company_id, employee_id, attendance_date };
        try {
          const updated = await DBObject.updateOne('hr_attendance', data, condition);
        } catch (error) {
          await DBObject.rollback();
          ;
          ThrowError("Error updating attendance.");
        }
      };

      await DBObject.commit();
      SaveAuditTrail({
        user_id: context.id,
        name: context.name,
        company_id,
        task: "UPDATE_MULTIPLE_ATTENDANCES",
        details: `Updated attendance for multiple employees (${employee_ids.join(',')}) on ${attendance_date} to ${check_in} - ${check_out}`,
      });
      return employee_ids.length;

    }
  }
};