import{n,r as o,f as s,q as r}from"./app-google-W6UBk0p3.js";import"./vendor-sqlite-DKEMZiEb.js";import"./app-membership-DTbXKmUW.js";import"./app-i18n-AXsF8jbs.js";import"./vendor-CkjNk_C8.js";function c(){if(typeof crypto<"u"&&typeof crypto.randomUUID=="function")return crypto.randomUUID();const e=Date.now().toString(16),t=Math.random().toString(16).slice(2,18).padEnd(16,"0");return`${e}${t}`.replace(/(.{8})(.{4})(.{4})(.{4})(.{12}).*/,"$1-$2-$3-$4-$5")}async function a(){const e=s(await r(`SELECT sync_epoch, snapshot_revision, ledger_revision, catalog_revision, updated_at
     FROM wear_sync_state WHERE id = 1 LIMIT 1;`));return e?{syncEpoch:String(e.sync_epoch),snapshotRevision:Number(e.snapshot_revision)||0,ledgerRevision:Number(e.ledger_revision)||0,catalogRevision:Number(e.catalog_revision)||0,updatedAt:e.updated_at}:d()}async function d(){const e=c(),t=n();return await o(`INSERT INTO wear_sync_state (id, sync_epoch, snapshot_revision, ledger_revision, catalog_revision, updated_at)
     VALUES (1, ?, 0, 0, 0, ?)
     ON CONFLICT(id) DO UPDATE SET
       sync_epoch = excluded.sync_epoch,
       snapshot_revision = 0,
       ledger_revision = 0,
       catalog_revision = 0,
       updated_at = excluded.updated_at;`,[e,t]),{syncEpoch:e,snapshotRevision:0,ledgerRevision:0,catalogRevision:0,updatedAt:t}}async function y(){const e=n();return await o(`UPDATE wear_sync_state
     SET snapshot_revision = snapshot_revision + 1, updated_at = ?
     WHERE id = 1;`,[e]),a()}async function g({ledger:e=!1,catalog:t=!1}={}){const i=n();return await o(`UPDATE wear_sync_state
     SET ledger_revision = ledger_revision + ?,
         catalog_revision = catalog_revision + ?,
         snapshot_revision = snapshot_revision + 1,
         updated_at = ?
     WHERE id = 1;`,[e?1:0,t?1:0,i]),a()}export{g as bumpWearLedgerAndCatalogRevisions,y as bumpWearSnapshotRevision,a as getWearSyncState,d as rotateWearSyncEpoch};
