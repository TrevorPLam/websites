# acuity-scheduling-documentation.md

# Acuity Scheduling API Documentation: Appointment Booking

## Overview

Acuity Scheduling (part of Squarespace) provides a robust API for automating appointment booking, managing calendars, and handling client intake forms. The API is REST-based and supports JSON for all data exchanges.

## Authentication

Authentication is handled via **Basic Auth** using your `User ID` and `API Key`.

- **Endpoint**: `https://acuityscheduling.com/api/v1`

## Core Workflow: Booking an Appointment

### 1. Identify Service and Type

Retrieve the available categories and appointment types to find the correct `appointmentTypeID`.

- `GET /appointment-types`

### 2. Check Availability

Find available dates and times for a specific service.

- **Dates**: `GET /availability/dates?appointmentTypeID={id}&month={YYYY-MM}`
- **Times**: `GET /availability/times?appointmentTypeID={id}&date={YYYY-MM-DD}`

### 3. Create the Appointment

Submit a `POST` request to schedule the appointment.

```javascript
// Example: Creating an appointment via Acuity API
const axios = require('axios');

const bookAppointment = async () => {
  const auth = Buffer.from('YOUR_USER_ID:YOUR_API_KEY').toString('base64');

  try {
    const response = await axios.post(
      'https://acuityscheduling.com/api/v1/appointments',
      {
        datetime: '2026-03-15T10:00:00-0500',
        appointmentTypeID: 123456,
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
      },
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Appointment booked:', response.data);
  } catch (error) {
    console.error('Error booking appointment:', error.response.data);
  }
};

bookAppointment();
```

## Advanced Features

### Webhooks

Acuity can send real-time notifications to your application for events like:

- `appointment.scheduled`
- `appointment.rescheduled`
- `appointment.canceled`

### Intake Forms

If the appointment type requires custom information, these fields must be populated in the `fields` array when creating the appointment.

## Best Practices

1. **User Timezones**: Always handle timezones explicitly by providing the `timezone` parameter or using ISO 8601 strings with offsets.
2. **Rate Limiting**: Be mindful of API limits and implement retries for 429 status codes.
3. **Sandbox Testing**: Use the testing tools provided in the Acuity Developer Hub before deploying to production.

## References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

- [Acuity Scheduling Developer Hub](https://developers.acuityscheduling.com/)
- [Acuity API v1 Reference](https://developers.acuityscheduling.com/reference)
- [Acuity Webhooks Guide](https://developers.acuityscheduling.com/docs/webhooks)
- [Handling Multi-User Access (OAuth2)](https://developers.acuityscheduling.com/docs/oauth2)

## Implementation

[Add content here]

## Testing

[Add content here]
