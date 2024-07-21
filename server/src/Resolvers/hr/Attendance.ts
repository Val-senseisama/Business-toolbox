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
      if (!Validate.integer(company_id) || !Validate.integer(employee_id)) {
        ThrowError("Invalid company or employee ID.");
      }
      const isAllowed = hasPermission({ context, company_id, tasks: ['getEmployeeAttendance'] });
      if (!isAllowed) {
        ThrowError('#NOACCESS');
      }

      try {
        const query = `
          SELECT * FROM hr_attendance
          WHERE company_id = :company_id
          AND employee_id = :employee_id
          AND attendance_date BETWEEN :start AND :end
        `;
        const params = { company_id, employee_id, start: attendance_date_start, end: attendance_date_end };
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
      if (!Validate.integer(company_id)) {
        ThrowError("Invalid company ID.");
      }
      const isAllowed = hasPermission({ context, company_id, tasks: ['getAllEmployeeAttendance'] });
      if (!isAllowed) {
        ThrowError('#NOACCESS');
      }

      try {
        const query = `
          SELECT * FROM hr_attendance
          WHERE company_id = :company_id
          AND attendance_date BETWEEN :start AND :end
        `;
        const params = { company_id, start: attendance_date_start, end: attendance_date_end };
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
      if (!Validate.integer(company_id) || !Validate.integer(employee_id)) {
        ThrowError("Invalid company or employee ID.");
      }
      const isAllowed = hasPermission({ context, company_id, tasks: ['checkEmployeeIn'] });
      if (!isAllowed) {
        ThrowError('#NOACCESS');
      }

      const checkInTime = new Date().toISOString().split('T')[1].slice(0, 5);
      const data = { company_id, employee_id, attendance_date: new Date().toISOString().split('T')[0], check_in: checkInTime, created_by: context.email };

      try {
        const attendanceId = await DBObject.insertOne('hr_attendance', data);
        SaveAuditTrail({
          user_id: context.id,
          name: context.name,
          company_id,
          task: "CHECK_IN",
          details: `Checked in employee ${employee_id} on ${data.attendance_date}`,
        });
        return attendanceId;
      } catch (error) {
        ThrowError("Error recording check-in.");
      }
    },

    async checkEmployeeOut(_, { company_id, employee_id }, context) {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }
      if (!Validate.integer(company_id) || !Validate.integer(employee_id)) {
        ThrowError("Invalid company or employee ID.");
      }
      const isAllowed = hasPermission({ context, company_id, tasks: ['checkEmployeeOut'] });
      if (!isAllowed) {
        ThrowError('#NOACCESS');
      }

      const checkOutTime = new Date().toISOString().split('T')[1].slice(0, 5);
      try {
        const updatedCount = await DBObject.updateOne('hr_attendance', { check_out: checkOutTime }, { company_id, employee_id, attendance_date: new Date().toISOString().split('T')[0] });
        if (updatedCount === 0) {
          ThrowError("Error: Attendance record not found or already checked out.");
        }
        SaveAuditTrail({
          user_id: context.id,
          name: context.name,
          company_id,
          task: "CHECK_OUT",
          details: `Checked out employee ${employee_id} at ${checkOutTime}`,
        });
        return updatedCount;
      } catch (error) {
        ThrowError("Error recording check-out.");
      }
    },

    async updateEmployeeAttendance(_, { company_id, employee_id, attendance_date, check_in, check_out }, context) {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }
      if (!Validate.integer(company_id) || !Validate.integer(employee_id)) {
        ThrowError("Invalid company or employee ID.");
      }
      if (!Validate.time(check_in) || !Validate.time(check_out)) {
        ThrowError("Invalid check-in or check-out time.");
      }
      const isAllowed = hasPermission({ context, company_id, tasks: ['updateEmployeeAttendance'] });
      if (!isAllowed) {
        ThrowError('#NOACCESS');
      }

      const data = { check_in, check_out };
      try {
        const updatedCount = await DBObject.updateOne('hr_attendance', data, { company_id, employee_id, attendance_date });
        SaveAuditTrail({
          user_id: context.id,
          name: context.name,
          company_id,
          task: "UPDATE_ATTENDANCE",
          details: `Updated attendance for employee ${employee_id} on ${attendance_date}`,
        });
        return updatedCount;
      } catch (error) {
        ThrowError("Error updating attendance.");
      }
    },

    async updateMultipleEmployeeAttendance(_, { company_id, employee_ids, attendance_date, check_in, check_out }, context) {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }
      if (!Validate.integer(company_id)) {
        ThrowError("Invalid company ID.");
      }
      if (!Validate.array(employee_ids)) {
        ThrowError("Invalid employee IDs.");
      }
      const isAllowed = hasPermission({ context, company_id, tasks: ['updateMultipleEmployeeAttendance'] });
      if (!isAllowed) {
        ThrowError('#NOACCESS');
      }

      const updates = employee_ids.map(employee_id => ({ company_id, employee_id, attendance_date, check_in, check_out }));
      try {
        // Use updateDirect here
        const updateCount = await DBObject.updateMany('hr_attendance', updates, { company_id, attendance_date, check_in, check_out });
        SaveAuditTrail({
          user_id: context.id,
          name: context.name,
          company_id,
          task: "UPDATE_MULTIPLE_ATTENDANCES",
          details: `Updated attendance for multiple employees on ${attendance_date}`,
        });
        return updateCount;
      } catch (error) {
        ThrowError("Error updating multiple attendance records.");
      }
    }
  }
};