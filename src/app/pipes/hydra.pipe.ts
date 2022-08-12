import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hydra'
})
export class HydraPipe implements PipeTransform {

  transform(value: number, userHydAmount?: number, period?: string) {
    // const votes = value / 10**8;
    // const delegates = 53;
    // const share = 0.85;
    // const blockReward = 8;
    // const blockTime = 12;
    // const secInOneDay = 86400;
    // const hydsPerDay = (secInOneDay / blockTime) * blockReward;
    // const delegateForgesPerDay = (hydsPerDay / delegates) * share;
    // // @ts-ignore
    // const userPartInVotes = userHydAmount / votes;
    // const userRewardPerDay = delegateForgesPerDay * userPartInVotes;
    //
    // return Math.round(userRewardPerDay) + ' Ħ';

    // const amount = value / 10 ** 8;
    // const wallet = 340000;
    // const share = 0.9;
    // const result = wallet * 100 / (amount * share);
    //
    // switch (period) {
    //   case 'day': return Math.floor(result / 365) + ' Ħ';
    //   case 'month': return Math.floor(result / 12) + ' Ħ';
    //   case 'year': return Math.floor(result) + ' Ħ';
    //   default: return Math.floor(amount) + ' Ħ';
    // }
  }

}
