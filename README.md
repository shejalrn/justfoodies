# JustFoodies Cloud Kitchen

A full-stack cloud kitchen food ordering web application with real-time order tracking.

## 🚀 Features

- **Menu Management**: Browse categories, filter by veg/non-veg, search items
- **Order System**: Place orders as guest or registered user
- **Real-time Tracking**: WebSocket-based order status updates
- **Admin Dashboard**: Order management, status updates, analytics
- **User Management**: Registration, login, profile, addresses
- **Payment Integration**: Ready for Razorpay integration
- **CMS Integration**: Sanity.io for dynamic content management

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, Prisma ORM, MySQL
- **Frontend**: React, Vite, Tailwind CSS
- **Real-time**: Socket.IO
- **CMS**: Sanity.io
- **Authentication**: JWT
- **Database**: MySQL 8+

## 🎨 Brand Colors

- Primary: `#4BA3A8`
- Accent: `#DE925B`
- Text: `#111111`
- Background: `#E5E7DF`

## 📦 Deployment

This project is configured for deployment with Coolify using Nixpacks.

### Environment Variables

Set these in your Coolify deployment:

```env
DATABASE_URL=mysql://username:password@host:3306/justfoodies
JWT_SECRET=your-production-jwt-secret
SANITY_PROJECT_ID=ybaq07b6
SANITY_TOKEN=your-sanity-token
ALLOWED_ORIGINS=https://justfoodie.in,https://www.justfoodie.in
```

### Database Setup

After deployment, run:
```bash
npm run db:push
npm run db:seed
```

## 📞 Contact

- **Phone**: +91 97678 56258
- **Email**: infoatjustfood@gmail.com
- **Address**: Sr no 99, Plot No.90 Lane No.8A, Seven Hills residence, nirgundi road, Lohegaon, Pune - 411047

## 📄 License

Private - JustFoodies Cloud Kitchen