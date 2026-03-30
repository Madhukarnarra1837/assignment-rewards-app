import React,{useMemo} from 'react'
import PropTypes from 'prop-types'
import { aggregateTotalRewards } from '../../utils/aggregationUtils'
import Table from '../common/Table';
/**
 * Displays total reward points earned per customer
 * across all transactions and months.
 * Aggregaion is based on stable customer identifiers.
 */
function TotalRewardsTable({transactions}) {
    // Derived data is memoized to avoid unnecessary recalculations.
    
    const data = useMemo(()=>{
        const aggregated = aggregateTotalRewards(transactions);
        return Object.values(aggregated)?.map(item => ({
            id:item?.customerId, //stable unique identifier
            customerName:item?.customerName,
            rewardPoints:item?.rewardPoints
        }))
    },[transactions])

    const columns = [
        {key:'customerName',label:'Customer Name'},
        {key:'rewardPoints',label:'Total Reward Points'}
    ]
  return (
    <>
    <h2>Total Rewards</h2>
    <Table columns={columns} data={data} pageSize={5}/>
    </>
  )
}

TotalRewardsTable.propTypes = {}

export default TotalRewardsTable
