import { internalResponse } from "../../../helpers/response.helpers"

class FeeService {
  async computeFees(feeDTO) {
    const { ID, Amount, SplitInfo } = feeDTO

    let final_split_results = []

    //filter out the split-type with flat
    const flat_split_types = SplitInfo.filter((si) => {
      return si.SplitType.toLowerCase() === "flat"
    })

    //filter out the split-type with percentage
    const percentage_split_types = SplitInfo.filter((si) => {
      return si.SplitType.toLowerCase() === "percentage"
    })

    //filter out the split-type with ratio
    const ratio_split_types = SplitInfo.filter((si) => {
      return si.SplitType.toLowerCase() === "ratio"
    })

    //concatenate the arrays (flat and percentage) into one, since order is always preserved
    let splitInfoArray_flat_perc = flat_split_types.concat(
      percentage_split_types
    )
    let amount = Number(Amount)

    for (const splitInfo of splitInfoArray_flat_perc) {
      if (splitInfo.SplitType.toLowerCase() === "flat") {
        amount = Number(amount) - Number(splitInfo.SplitValue)

        if (amount > Number(Amount)) {
          return this.internalResponse(
            false,
            splitInfo,
            400,
            "Check that you entered the correct data as the computed amount should not be greater than the transactional amount"
          )
        }

        let res_obj_flat = {
          SplitEntityId: splitInfo.SplitEntityId,
          Amount: splitInfo.SplitValue,
        }
        final_split_results.push(res_obj_flat)
      }

      if (splitInfo.SplitType.toLowerCase() === "percentage") {
        let perc_amount = (Number(splitInfo.SplitValue) / 100) * amount
        amount = Number(amount) - perc_amount

        if (perc_amount > Number(Amount)) {
          return this.internalResponse(
            false,
            splitInfo,
            400,
            "Check that you entered the correct data as the computed amount should not be greater than the transactional amount"
          )
        }

        let res_obj_perc = {
          SplitEntityId: splitInfo.SplitEntityId,
          Amount: perc_amount,
        }
        final_split_results.push(res_obj_perc)
      }
    }

    let rem_amount = amount

    //RATIO TYPES AS CALC IS DIFFERENT
    if (ratio_split_types.length > 0) {
      //total ratio value
      let total_ratio_value = ratio_split_types.reduce((acc, curr) => {
        return acc + Number(curr.SplitValue)
      }, 0)

      for (const ratioSplit of ratio_split_types) {
        let ratio_amount =
          (Number(ratioSplit.SplitValue) / Number(total_ratio_value)) *
          rem_amount
        amount = Number(amount) - ratio_amount

        if (ratio_amount > Number(Amount)) {
          return this.internalResponse(
            false,
            ratioSplit,
            400,
            "Check that you entered the correct data as the computed amount should not be greater than the transactional amount"
          )
        }

        let res_obj_ratio = {
          SplitEntityId: ratioSplit.SplitEntityId,
          Amount: ratio_amount,
        }
        final_split_results.push(res_obj_ratio)
      }
    }

    //constraint 2
    if (amount < 0) {
      return this.internalResponse(
        false,
        {},
        400,
        "Check that you entered the correct data as balance should not be less than 0"
      )
    }

    if (final_split_results.length > 0) {
      let total_amount = final_split_results.reduce((acc, curr) => {
        return acc + Number(curr.Amount)
      }, 0)

      if (total_amount > Number(Amount)) {
        return this.internalResponse(
          false,
          {},
          400,
          "Check that you entered thr correct data as total amount computed should not be grater than the transactional amount"
        )
      }
    }

    let response = {
      ID,
      Balance: amount,
      SplitBreakdown: final_split_results,
    }

    return internalResponse(
      true,
      response,
      200,
      "split amount computation done!"
    )
  }
}

export const feeService = new FeeService()
