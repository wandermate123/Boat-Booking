-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reference" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "amountRupees" INTEGER NOT NULL,
    "amountPaise" INTEGER NOT NULL,
    "experienceId" TEXT NOT NULL,
    "journeyTitle" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "guests" INTEGER NOT NULL,
    "slot" TEXT NOT NULL,
    "slotLabel" TEXT NOT NULL,
    "addOnIdsJson" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "customerEmail" TEXT,
    "notes" TEXT,
    "razorpayOrderId" TEXT,
    "razorpayPaymentId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paidAt" DATETIME
);

-- CreateIndex
CREATE UNIQUE INDEX "Booking_reference_key" ON "Booking"("reference");
