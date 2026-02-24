export interface BookingReminderProps {
  tenantName: string;
  customerName: string;
  bookingDate: string;
  bookingTime: string;
  serviceType: string;
  location: string;
  staffName?: string;
  notes?: string;
  cancellationUrl: string;
  rescheduleUrl: string;
}

export function BookingReminder({
  tenantName,
  customerName,
  bookingDate,
  bookingTime,
  serviceType,
  location,
  staffName,
  notes,
  cancellationUrl,
  rescheduleUrl,
}: BookingReminderProps) {
  return (
    <div>
      <h1>Booking Reminder</h1>
      <h2>{tenantName}</h2>

      <p>Dear {customerName},</p>
      <p>This is a friendly reminder about your upcoming appointment.</p>

      <div>
        <h3>Booking Details</h3>
        <p>
          <strong>Date:</strong> {bookingDate}
        </p>
        <p>
          <strong>Time:</strong> {bookingTime}
        </p>
        <p>
          <strong>Service:</strong> {serviceType}
        </p>
        <p>
          <strong>Location:</strong> {location}
        </p>
        {staffName && (
          <p>
            <strong>Staff:</strong> {staffName}
          </p>
        )}
        {notes && (
          <p>
            <strong>Notes:</strong> {notes}
          </p>
        )}
      </div>

      <div>
        <h3>What to Bring</h3>
        <ul>
          <li>Valid ID (if required)</li>
          <li>Any relevant documents</li>
          <li>Payment method (if applicable)</li>
        </ul>
      </div>

      <div>
        <h3>Need to Make Changes?</h3>
        <p>
          Life happens! If you need to reschedule or cancel, please do so at least 24 hours in
          advance:
        </p>
        <p>
          <a href={rescheduleUrl}>Reschedule Appointment</a> |
          <a href={cancellationUrl}>Cancel Appointment</a>
        </p>
      </div>

      <div>
        <h3>Contact Information</h3>
        <p>If you have any questions or need to reach us before your appointment:</p>
        <p>Phone: [Your Phone Number]</p>
        <p>Email: [Your Email Address]</p>
      </div>

      <p>We look forward to seeing you!</p>

      <p>
        Best regards,
        <br />
        The {tenantName} Team
      </p>
    </div>
  );
}
