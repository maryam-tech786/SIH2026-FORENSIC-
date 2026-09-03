import { INITIAL_CUSTODY_CHAINS } from '../data/mockCustodyChain';

// In-memory ledger storage per case
const chainsStore = { ...INITIAL_CUSTODY_CHAINS };

const delay = (ms = 250) => new Promise(resolve => setTimeout(resolve, ms));

const generateHash = () => {
  return Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
};

export const getCustodyChain = async (caseId) => {
  await delay(200);
  if (!chainsStore[caseId]) {
    // Generate default genesis block if case has no chain yet
    chainsStore[caseId] = [
      {
        index: 0,
        action: 'GENESIS_BLOCK',
        actionLabel: 'Case Initialized & Custody Ledger Spawned',
        actor: 'NTRO Key Authority / Root CA',
        actorRole: 'Automated Root CA',
        timestamp: new Date().toISOString(),
        evidenceId: null,
        evidenceName: `Case Ledger: ${caseId}`,
        previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
        currentHash: generateHash(),
        payload: { caseId, initialized: true },
        isTampered: false,
      }
    ];
  }
  return [...chainsStore[caseId]];
};

export const appendBlock = async (caseId, blockData) => {
  const chain = await getCustodyChain(caseId);
  const lastBlock = chain[chain.length - 1];
  
  const newBlock = {
    index: chain.length,
    action: blockData.action || 'GENERAL_AUDIT_ACTION',
    actionLabel: blockData.actionLabel || 'Evidentiary Interaction Logged',
    actor: blockData.actor || 'Forensic System',
    actorRole: blockData.actorRole || 'System Operator',
    timestamp: new Date().toISOString(),
    evidenceId: blockData.evidenceId || null,
    evidenceName: blockData.evidenceName || 'Case Repository',
    previousHash: lastBlock ? lastBlock.currentHash : '0000000000000000000000000000000000000000000000000000000000000000',
    currentHash: generateHash(),
    payload: blockData.payload || {},
    isTampered: false,
  };

  chainsStore[caseId].push(newBlock);
  return newBlock;
};

// Deliberately corrupt a block's currentHash or payload to demonstrate cryptographic verification failure
export const toggleSimulateTamper = async (caseId, blockIndex = 3) => {
  await delay(150);
  const chain = chainsStore[caseId];
  if (!chain || !chain[blockIndex]) return null;

  const target = chain[blockIndex];
  if (target.isTampered) {
    // Restore
    target.isTampered = false;
    // Re-link properly
    target.currentHash = target.originalHash || generateHash();
    if (chain[blockIndex + 1]) {
      chain[blockIndex + 1].previousHash = target.currentHash;
    }
  } else {
    // Corrupt
    target.isTampered = true;
    target.originalHash = target.currentHash;
    // Break the hash
    target.currentHash = 'deadbeef' + target.currentHash.substring(8);
    // Deliberately do NOT update next block's previousHash, causing a cryptographic hash link break!
  }

  return { ...target };
};

export const verifyChainIntegrity = async (caseId) => {
  await delay(800); // realistic verification calculation delay
  const chain = await getCustodyChain(caseId);
  
  const brokenLinks = [];
  
  for (let i = 1; i < chain.length; i++) {
    const prev = chain[i - 1];
    const curr = chain[i];

    if (curr.previousHash !== prev.currentHash || prev.isTampered || curr.isTampered) {
      brokenLinks.push({
        failedIndex: i,
        brokenBetween: `Block #${i - 1} and Block #${i}`,
        expectedPrevHash: prev.currentHash,
        recordedPrevHash: curr.previousHash,
        reason: prev.isTampered
          ? `Block #${i - 1} payload/hash corrupted post-minting`
          : `Hash mismatch: Parent block SHA-256 does not match child reference`,
      });
    }
  }

  const isValid = brokenLinks.length === 0;

  return {
    isValid,
    totalBlocksChecked: chain.length,
    brokenLinksCount: brokenLinks.length,
    brokenLinks,
    auditTimestamp: new Date().toISOString(),
    merkleRoot: generateHash(),
  };
};
