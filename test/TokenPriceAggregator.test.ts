import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signers';
import { expect } from 'chai';
import { ethers, upgrades } from 'hardhat';
import { BigNumber, constants, utils } from 'ethers';
import { emitAmounts } from '../deploy/config';
import { increaseTime, getTimeStamp, gWei } from '../helper';
import {
  BondNoTreasury,
  MockPrinciple,
  RewardToken,
  PriceOracleAggregator,
  MockOracle,
  Emissionor,
  Splitter,
  RewardWeight,
  LockFarm,
  TokenVault,
  FNFT,
  LockAddressRegistry,
  HectorMinterMock,
} from '../types';

describe('BondV3.1 with no treasury', function () {
  let owner: SignerWithAddress;
  let alice: SignerWithAddress;
  let bob: SignerWithAddress;
  let fundRecipient: SignerWithAddress;
  let feeRecipient1: SignerWithAddress;
  let feeRecipient2: SignerWithAddress;
  let autoStakingFeeRecipient: SignerWithAddress;

  let hectorToken: RewardToken;
  let stablePrincipal: MockPrinciple;
  let nonStablePrincipal: MockPrinciple;
  let lpPrincipal: MockPrinciple;
  let hectorOracle: MockOracle;
  let stableOracle: MockOracle;
  let nonStableOracle: MockOracle;
  let lpOracle: MockOracle;
  let priceOracleAggregator: PriceOracleAggregator;
  let bond: BondNoTreasury;

  beforeEach(async function () {
    [
      owner,
      alice,
      bob,
      feeRecipient1,
      feeRecipient2,
      fundRecipient,
      autoStakingFeeRecipient,
    ] = await ethers.getSigners();

    const HectorToken = await ethers.getContractFactory('RewardToken');
    hectorToken = (await HectorToken.deploy()) as RewardToken;

    const Principle = await ethers.getContractFactory('MockPrinciple');
    stablePrincipal = (await Principle.deploy()) as MockPrinciple;
    nonStablePrincipal = (await Principle.deploy()) as MockPrinciple;
    lpPrincipal = (await Principle.deploy()) as MockPrinciple;

    const Oracle = await ethers.getContractFactory('MockOracle');
    hectorOracle = (await Oracle.deploy(
      hectorToken.address,
      1000000000 // 10$
    )) as MockOracle;
    stableOracle = (await Oracle.deploy(
      stablePrincipal.address,
      100000000 // 1$
    )) as MockOracle;
    nonStableOracle = (await Oracle.deploy(
      nonStablePrincipal.address,
      2000000000 // 20$
    )) as MockOracle;
    lpOracle = (await Oracle.deploy(
      lpPrincipal.address,
      100000000000000 // 1000000$
    )) as MockOracle;

    const PriceOracleAggregator = await ethers.getContractFactory(
      'PriceOracleAggregator'
    );
    priceOracleAggregator =
      (await PriceOracleAggregator.deploy()) as PriceOracleAggregator;
    await priceOracleAggregator.updateOracleForAsset(
      hectorToken.address,
      hectorOracle.address
    );
    await priceOracleAggregator.updateOracleForAsset(
      stablePrincipal.address,
      stableOracle.address
    );
    await priceOracleAggregator.updateOracleForAsset(
      nonStablePrincipal.address,
      nonStableOracle.address
    );
    await priceOracleAggregator.updateOracleForAsset(
      lpPrincipal.address,
      lpOracle.address
    );

  });

  describe('#price oracle aggregator', () => {
    it('viewPriceInUSD', async function () {
      // 10$
      expect(
        await priceOracleAggregator.viewPriceInUSD(hectorToken.address)
      ).equal(1000000000);
      // 1$
      expect(
        await priceOracleAggregator.viewPriceInUSD(stablePrincipal.address)
      ).equal(100000000);
      // 20$
      expect(
        await priceOracleAggregator.viewPriceInUSD(nonStablePrincipal.address)
      ).equal(2000000000);
      // 1000000$
      expect(
        await priceOracleAggregator.viewPriceInUSD(lpPrincipal.address)
      ).equal(100000000000000);
    });
  });


});
