import React from 'react'
import { Text, View } from 'react-native'

const PillView = () => (
    <View className='flex-row justify-center items-center text-gray-500 p-1 bg-gray-400 rounded-full w-[100px]'>
        <Text className='w-fit'>New way</Text>
    </View>
)

const NewCard = () => {
    return (
        <View className='flex-col'>
            <Text className='text-white capitalize font-bold text-base'>Border security assessments - District security</Text>
            <PillView />
        </View>
    )
}

export default NewCard