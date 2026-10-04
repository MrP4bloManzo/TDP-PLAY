CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');
CREATE TYPE "MatchStatus" AS ENUM ('SCHEDULED', 'LIVE', 'FINISHED', 'CANCELLED');
CREATE TYPE "PredictionStatus" AS ENUM ('PENDING', 'WON', 'LOST', 'VOID');
CREATE TYPE "WalletTransactionType" AS ENUM ('BONUS', 'BET', 'WIN', 'REFUND', 'ADJUSTMENT');
CREATE TYPE "CasinoGameStatus" AS ENUM ('ACTIVE', 'PLAYER_WIN', 'DEALER_WIN', 'PUSH', 'BLACKJACK', 'PLAYER_BUST', 'COMPLETE');

CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "username" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "role" "Role" NOT NULL DEFAULT 'USER',
  "level" INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "User_role_idx" ON "User"("role");
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");

CREATE TABLE "Wallet" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "balance" INTEGER NOT NULL DEFAULT 10000,
  "totalWon" INTEGER NOT NULL DEFAULT 0,
  "totalLost" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Wallet_userId_key" ON "Wallet"("userId");
CREATE INDEX "Wallet_balance_idx" ON "Wallet"("balance");
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "WalletTransaction" (
  "id" TEXT NOT NULL,
  "walletId" TEXT NOT NULL,
  "type" "WalletTransactionType" NOT NULL,
  "amount" INTEGER NOT NULL,
  "balanceAfter" INTEGER NOT NULL,
  "description" TEXT NOT NULL,
  "reference" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "WalletTransaction_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "WalletTransaction_walletId_createdAt_idx" ON "WalletTransaction"("walletId", "createdAt");
ALTER TABLE "WalletTransaction" ADD CONSTRAINT "WalletTransaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "Group" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "region" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Group_name_key" ON "Group"("name");

CREATE TABLE "Team" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "shortName" TEXT NOT NULL,
  "badgeColor" TEXT NOT NULL,
  "groupId" TEXT NOT NULL,
  "wins" INTEGER NOT NULL DEFAULT 0,
  "draws" INTEGER NOT NULL DEFAULT 0,
  "losses" INTEGER NOT NULL DEFAULT 0,
  "goalsFor" INTEGER NOT NULL DEFAULT 0,
  "goalsAgainst" INTEGER NOT NULL DEFAULT 0,
  "points" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Team_name_key" ON "Team"("name");
CREATE INDEX "Team_groupId_idx" ON "Team"("groupId");
CREATE INDEX "Team_points_idx" ON "Team"("points");
ALTER TABLE "Team" ADD CONSTRAINT "Team_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "Match" (
  "id" TEXT NOT NULL,
  "homeTeamId" TEXT NOT NULL,
  "awayTeamId" TEXT NOT NULL,
  "groupId" TEXT NOT NULL,
  "date" TIMESTAMP(3) NOT NULL,
  "stadium" TEXT NOT NULL,
  "status" "MatchStatus" NOT NULL DEFAULT 'SCHEDULED',
  "homeScore" INTEGER,
  "awayScore" INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Match_date_idx" ON "Match"("date");
CREATE INDEX "Match_status_idx" ON "Match"("status");
CREATE INDEX "Match_groupId_date_idx" ON "Match"("groupId", "date");
ALTER TABLE "Match" ADD CONSTRAINT "Match_homeTeamId_fkey" FOREIGN KEY ("homeTeamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Match" ADD CONSTRAINT "Match_awayTeamId_fkey" FOREIGN KEY ("awayTeamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Match" ADD CONSTRAINT "Match_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "PredictionMarket" (
  "id" TEXT NOT NULL,
  "matchId" TEXT NOT NULL,
  "market" TEXT NOT NULL,
  "selection" TEXT NOT NULL,
  "odds" DOUBLE PRECISION NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PredictionMarket_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "PredictionMarket_matchId_market_selection_key" ON "PredictionMarket"("matchId", "market", "selection");
CREATE INDEX "PredictionMarket_matchId_active_idx" ON "PredictionMarket"("matchId", "active");
ALTER TABLE "PredictionMarket" ADD CONSTRAINT "PredictionMarket_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "Prediction" (
  "id" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "matchId" TEXT NOT NULL,
  "market" TEXT NOT NULL,
  "selection" TEXT NOT NULL,
  "odds" DOUBLE PRECISION NOT NULL,
  "stake" INTEGER NOT NULL,
  "potentialPrize" INTEGER NOT NULL,
  "status" "PredictionStatus" NOT NULL DEFAULT 'PENDING',
  "settledAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Prediction_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Prediction_code_key" ON "Prediction"("code");
CREATE INDEX "Prediction_userId_createdAt_idx" ON "Prediction"("userId", "createdAt");
CREATE INDEX "Prediction_matchId_status_idx" ON "Prediction"("matchId", "status");
ALTER TABLE "Prediction" ADD CONSTRAINT "Prediction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Prediction" ADD CONSTRAINT "Prediction_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "BlackjackGame" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "bet" INTEGER NOT NULL,
  "playerCards" JSONB NOT NULL,
  "dealerCards" JSONB NOT NULL,
  "deck" JSONB NOT NULL,
  "status" "CasinoGameStatus" NOT NULL DEFAULT 'ACTIVE',
  "payout" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "BlackjackGame_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "BlackjackGame_userId_createdAt_idx" ON "BlackjackGame"("userId", "createdAt");
CREATE INDEX "BlackjackGame_status_idx" ON "BlackjackGame"("status");
ALTER TABLE "BlackjackGame" ADD CONSTRAINT "BlackjackGame_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "RouletteGame" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "bet" INTEGER NOT NULL,
  "selectionType" TEXT NOT NULL,
  "selectionValue" TEXT NOT NULL,
  "winningNumber" INTEGER NOT NULL,
  "won" BOOLEAN NOT NULL,
  "payout" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "RouletteGame_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "RouletteGame_userId_createdAt_idx" ON "RouletteGame"("userId", "createdAt");
ALTER TABLE "RouletteGame" ADD CONSTRAINT "RouletteGame_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "AdminAction" (
  "id" TEXT NOT NULL,
  "adminId" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "targetId" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AdminAction_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "AdminAction_adminId_createdAt_idx" ON "AdminAction"("adminId", "createdAt");
ALTER TABLE "AdminAction" ADD CONSTRAINT "AdminAction_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "Leaderboard" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "score" INTEGER NOT NULL DEFAULT 0,
  "rank" INTEGER NOT NULL DEFAULT 0,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Leaderboard_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Leaderboard_userId_key" ON "Leaderboard"("userId");
CREATE INDEX "Leaderboard_score_idx" ON "Leaderboard"("score");
