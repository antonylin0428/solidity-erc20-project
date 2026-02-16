import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import ClubDAOABI from '../contracts/ClubDAO.json'

export function useDelegation(daoAddress, userAddress) {
  const isValid = daoAddress && userAddress

  const { data: hasDelegated, refetch: refetchHasDelegated } = useReadContract({
    address: daoAddress,
    abi: ClubDAOABI.abi,
    functionName: 'hasDelegated',
    args: [userAddress],
    query: { enabled: isValid },
  })

  const { data: delegatedTo, refetch: refetchDelegatedTo } = useReadContract({
    address: daoAddress,
    abi: ClubDAOABI.abi,
    functionName: 'delegation',
    args: [userAddress],
    query: { enabled: isValid && hasDelegated },
  })

  const { data: delegators, refetch: refetchDelegators } = useReadContract({
    address: daoAddress,
    abi: ClubDAOABI.abi,
    functionName: 'getDelegators',
    args: [userAddress],
    query: { enabled: isValid },
  })

  const { data: votingPower, refetch: refetchVotingPower } = useReadContract({
    address: daoAddress,
    abi: ClubDAOABI.abi,
    functionName: 'getVotingPower',
    args: [userAddress],
    query: { enabled: isValid },
  })

  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

  const delegate = async (delegateeAddress) => {
    await writeContract({
      address: daoAddress,
      abi: ClubDAOABI.abi,
      functionName: 'delegate',
      args: [delegateeAddress],
    })
    setTimeout(() => {
      refetchHasDelegated()
      refetchDelegatedTo()
      refetchVotingPower()
    }, 2000)
  }

  const revokeDelegation = async () => {
    await writeContract({
      address: daoAddress,
      abi: ClubDAOABI.abi,
      functionName: 'revokeDelegation',
    })
    setTimeout(() => {
      refetchHasDelegated()
      refetchDelegatedTo()
      refetchVotingPower()
    }, 2000)
  }

  return {
    hasDelegated: hasDelegated || false,
    delegatedTo: delegatedTo || null,
    delegators: delegators || [],
    votingPower: votingPower ? Number(votingPower) : 1,
    delegate,
    revokeDelegation,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    error: writeError,
  }
}
