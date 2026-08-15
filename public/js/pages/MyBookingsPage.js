// Passage My Bookings Component with Direct Landlord WhatsApp Contact

window.MyBookingsPage = function MyBookingsPage({
  activeCurrency,
  currencyRates,
  onNavigate
}) {
  const [bookings, setBookings] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedBookingForReview, setSelectedBookingForReview] = React.useState(null);

  // Review form state
  const [rating, setRating] = React.useState(5);
  const [comment, setComment] = React.useState('');
  const [submittingReview, setSubmittingReview] = React.useState(false);
  const user = window.PassageAPI.getStoredUser();
  React.useEffect(() => {
    window.PassageAPI.getMyBookings().then(data => {
      setBookings(data || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);
  const handleReviewSubmit = async e => {
    e.preventDefault();
    if (!selectedBookingForReview || !comment.trim()) return;
    setSubmittingReview(true);
    try {
      await window.PassageAPI.createReview({
        propertyId: selectedBookingForReview.propertyId._id || selectedBookingForReview.propertyId,
        bookingId: selectedBookingForReview._id,
        tenantName: user ? user.name : 'Expat Tenant',
        tenantCountry: user ? user.nationality : 'Foreign Expats',
        tenantAvatar: user ? user.avatar : '',
        rating: Number(rating),
        cleanliness: Number(rating),
        location: Number(rating),
        communication: Number(rating),
        value: Number(rating),
        comment: comment.trim()
      });
      alert('Thank you! Your verified review has been submitted.');
      setSelectedBookingForReview(null);
      setComment('');
    } catch (err) {
      alert(err.message || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };
  const handleWhatsAppHost = booking => {
    const prop = booking.propertyId || {};
    const ownerPhone = booking.ownerId?.phone || prop.ownerId?.phone || '919876543210';
    const tenantName = user ? user.name : 'Expat Guest';
    const message = `Hi! This is ${tenantName} regarding reservation #${booking.bookingNumber} for "${prop.title || 'Passage Residence'}". Status: ${booking.status.toUpperCase()}. Let me know if you need any check-in details or FRRO Form C passport copies!`;
    window.PassageAPI.openWhatsApp(ownerPhone, message);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "max-w-5xl mx-auto px-4 py-10 space-y-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between border-b border-slate-200 pb-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl font-extrabold text-slate-900"
  }, "My Rental Reservations"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500"
  }, "Track active bookings, payment receipts, and landlord FRRO documents")), /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('search'),
    className: "px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl"
  }, "Browse More Homes")), loading ? /*#__PURE__*/React.createElement("div", {
    className: "py-20 text-center space-y-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-circle-notch fa-spin text-3xl text-teal-600"
  }), /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-bold text-slate-500"
  }, "Fetching your reservation history...")) : bookings.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-2xl text-slate-400"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-receipt"
  })), /*#__PURE__*/React.createElement("h3", {
    className: "text-base font-bold text-slate-900"
  }, "No active or past bookings"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500"
  }, "You haven't reserved any Passage verified homes yet."), /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('search'),
    className: "px-5 py-2.5 bg-teal-600 text-white text-xs font-bold rounded-xl"
  }, "Explore Furnished Homes")) : /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, bookings.map(b => {
    const prop = b.propertyId || {};
    const priceFormatted = window.PassageAPI.formatCurrency(b.totalAmount, activeCurrency, currencyRates);
    return /*#__PURE__*/React.createElement("div", {
      key: b._id,
      className: "bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center space-x-4"
    }, /*#__PURE__*/React.createElement("img", {
      src: prop.coverImage || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=300&q=80',
      alt: prop.title,
      className: "w-20 h-20 rounded-2xl object-cover"
    }), /*#__PURE__*/React.createElement("div", {
      className: "space-y-1"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center space-x-2"
    }, /*#__PURE__*/React.createElement("span", {
      className: "bg-teal-50 text-teal-700 text-[10px] font-extrabold px-2 py-0.5 rounded border border-teal-200 uppercase"
    }, b.bookingNumber), /*#__PURE__*/React.createElement("span", {
      className: `text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`
    }, b.status)), /*#__PURE__*/React.createElement("h3", {
      className: "font-extrabold text-sm text-slate-900"
    }, prop.title || 'Passage Residence'), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-slate-500"
    }, prop.address || prop.city), /*#__PURE__*/React.createElement("p", {
      className: "text-[11px] text-slate-400"
    }, new Date(b.checkIn).toLocaleDateString(), " \u2014 ", new Date(b.checkOut).toLocaleDateString()))), /*#__PURE__*/React.createElement("div", {
      className: "flex md:flex-col items-end justify-between w-full md:w-auto border-t md:border-t-0 border-slate-100 pt-4 md:pt-0"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-right"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-base font-extrabold text-teal-600 block"
    }, priceFormatted), /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] text-slate-400 block font-semibold"
    }, "Payment: ", b.paymentStatus)), /*#__PURE__*/React.createElement("div", {
      className: "mt-3 flex items-center space-x-2"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => handleWhatsAppHost(b),
      className: "px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center space-x-1 shadow-sm",
      title: "Chat directly with Landlord Host on WhatsApp"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-brands fa-whatsapp text-sm"
    }), /*#__PURE__*/React.createElement("span", null, "WhatsApp Host")), /*#__PURE__*/React.createElement("button", {
      onClick: () => setSelectedBookingForReview(b),
      className: "px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl"
    }, "Write Review"), /*#__PURE__*/React.createElement("button", {
      onClick: () => onNavigate('property-detail', {
        id: prop._id
      }),
      className: "px-3 py-1.5 bg-teal-50 text-teal-700 border border-teal-200 text-xs font-bold rounded-xl"
    }, "View Home"))));
  })), selectedBookingForReview && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-3xl p-6 max-w-md w-full space-y-4 text-xs text-slate-800 shadow-2xl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between border-b pb-3"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-extrabold text-sm text-slate-900"
  }, "Leave a Verified Review"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setSelectedBookingForReview(null),
    className: "text-slate-400 hover:text-slate-600"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-xmark"
  }))), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleReviewSubmit,
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold mb-1"
  }, "Overall Rating (1 to 5 Stars)"), /*#__PURE__*/React.createElement("select", {
    value: rating,
    onChange: e => setRating(e.target.value),
    className: "w-full bg-slate-50 border rounded-xl p-2.5 font-bold"
  }, /*#__PURE__*/React.createElement("option", {
    value: "5"
  }, "\u2B50\u2B50\u2B50\u2B50\u2B50 (5/5 - Outstanding Expat Stay)"), /*#__PURE__*/React.createElement("option", {
    value: "4"
  }, "\u2B50\u2B50\u2B50\u2B50 (4/5 - Very Good)"), /*#__PURE__*/React.createElement("option", {
    value: "3"
  }, "\u2B50\u2B50\u2B50 (3/5 - Average)"), /*#__PURE__*/React.createElement("option", {
    value: "2"
  }, "\u2B50\u2B50 (2/5 - Poor)"), /*#__PURE__*/React.createElement("option", {
    value: "1"
  }, "\u2B50 (1/5 - Terrible)"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold mb-1"
  }, "Your Review & Experience"), /*#__PURE__*/React.createElement("textarea", {
    rows: "4",
    required: true,
    value: comment,
    onChange: e => setComment(e.target.value),
    placeholder: "Mention landlord FRRO help, internet reliability, neighborhood safety...",
    className: "w-full bg-slate-50 border rounded-xl p-3 text-xs"
  })), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    disabled: submittingReview,
    className: "w-full bg-teal-600 hover:bg-teal-500 text-white font-extrabold py-3 rounded-xl shadow-md"
  }, submittingReview ? 'Submitting...' : 'Submit Verified Review')))));
};