import { Booking } from "../models/booking.model.js";

const createBooking = async (req, res) => {
  try {
    const { name, email, mobile, date, guest, message, productSlug } = req.body;

    // Validation
    if (!name || !email || !mobile || !date || !guest || !productSlug) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const booking = new Booking({
      name,
      email,
      mobile,
      date,
      guest,
      message,
      productSlug,
    });

    await booking.save();

    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getBookingsByProduct = async (req, res) => {
  try {
    const { slug } = req.params;
    const bookings = await Booking.find({ productSlug: slug }).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export { createBooking, getAllBookings, getBookingsByProduct };
