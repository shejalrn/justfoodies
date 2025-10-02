# Coolify MySQL Database Access Guide

## Connection Details
- **Host**: `bg4gcgk4gwoo48w0g0kcgsco`
- **Port**: `3306`
- **Database**: `default`
- **Username**: `mysql`
- **Password**: `CrXTVN012Pi2GToPlJws7lzDAdZeOtW4cOLPA1HvikZwJAnkRdyrY7VeBDA4MCiU`

## Access Methods

### 1. Using MySQL Command Line (from Coolify server)
```bash
mysql -h bg4gcgk4gwoo48w0g0kcgsco -P 3306 -u mysql -p default
# Enter password when prompted
```

### 2. Using phpMyAdmin (if available)
- URL: Check Coolify dashboard for phpMyAdmin service
- Username: `mysql`
- Password: `CrXTVN012Pi2GToPlJws7lzDAdZeOtW4cOLPA1HvikZwJAnkRdyrY7VeBDA4MCiU`

### 3. Using MySQL Workbench
- Connection Name: JustFoodie Production
- Hostname: `bg4gcgk4gwoo48w0g0kcgsco`
- Port: `3306`
- Username: `mysql`
- Password: `CrXTVN012Pi2GToPlJws7lzDAdZeOtW4cOLPA1HvikZwJAnkRdyrY7VeBDA4MCiU`
- Default Schema: `default`

### 4. Using Prisma Studio (Recommended)
```bash
# From your project directory
npx prisma studio --browser none
# Then access via http://localhost:5555
```

## Common Database Operations

### Check Tables
```sql
SHOW TABLES;
```

### Check Users Table
```sql
SELECT * FROM User LIMIT 10;
```

### Check Orders Table
```sql
SELECT * FROM Order LIMIT 10;
```

### Reset Database (if needed)
```bash
# Push schema
npm run db:push

# Seed data
npm run db:seed
```

## Troubleshooting

### If connection fails:
1. Check if MySQL service is running in Coolify
2. Verify network connectivity
3. Ensure credentials are correct
4. Check if database exists

### If tables don't exist:
```bash
npm run db:push
```

### If no data:
```bash
npm run db:seed
```