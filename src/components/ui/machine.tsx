import * as React from 'react'
import { View, Text, StyleSheet, TextInput, Switch } from 'react-native'
import { CategoryFieldType, CategoryFields, Category as TCategory, Machine as TMachine } from '../../types'

import Select from './select'
import Button from './button'
import DateTimePicker from '@react-native-community/datetimepicker'
import { editMachine, deleteMachine } from '../../store/machineSlice'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { categoryFieldTypes } from '../../constants'

export default function Machine(props: TMachine) {

    const { categories } = useAppSelector(store => store.categories)
    const selectedCategory = categories.find(category => category.id === props.typeId)
    const [machineState, setMachineState] = React.useState<TMachine>(props)

    const [isCollapsed, setCollapsed] = React.useState<boolean>(false)
    const dispatch = useAppDispatch()


    React.useEffect(() => {
        dispatch(editMachine(machineState))
    }, [machineState])

    const handleAttributeChange = React.useCallback((key: string, value: TMachine['attributes'][number]['value'], type?: CategoryFieldType) => {

        setMachineState(oldMachineState => {
            const attrs = [...oldMachineState.attributes]
            const attributeIndex = attrs.findIndex(attr => attr.key === key)

            if (attributeIndex !== -1) {
                attrs[attributeIndex] = { ...attrs[attributeIndex], value }
            } else {
                attrs.push({ key, value, type })
            }

            const newMachineState = { ...oldMachineState, attributes: attrs }
            return newMachineState
        })
    }, [])


    const getAttributeComponent = React.useCallback((attr: TMachine['attributes'][number]) => {
        switch (attr.type) {
            case CategoryFieldType.text:
                return (
                    <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center', flex: 1 }}>
                        <Text style={machineStyles.fieldLabel}>{attr.key}: </Text>
                        <TextInput
                            autoCapitalize='none'
                            style={{ ...machineStyles.textInput, flex: 2 }}
                            onChangeText={(text) => handleAttributeChange(attr.key, text, attr.type)}
                            placeholder={`Enter ${attr.key}`}
                            value={machineState.attributes.find(a => a.key === attr.key)?.value.toString() || ''}
                        />
                    </View>
                )
            case CategoryFieldType.number:
                return (
                    <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center', flex: 1 }}>
                        <Text style={machineStyles.fieldLabel}>{attr.key}: </Text>
                        <TextInput
                            autoCapitalize='none'
                            keyboardType='numeric'
                            style={{ ...machineStyles.textInput, flex: 2 }}
                            onChangeText={(text) => handleAttributeChange(attr.key, text, attr.type)}
                            placeholder={`Enter ${attr.key}`}
                            value={machineState.attributes.find(a => a.key === attr.key)?.value.toString() || ''}
                        />
                    </View>
                )
            case CategoryFieldType.date:
                return (
                    <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                        <Text>{attr.key}: </Text>

                        <DateTimePicker
                            value={machineState.attributes.find(a => a.key === attr.key)?.value as Date || new Date()}
                            mode={'date'}
                            is24Hour={true}
                            onChange={(_, date) => handleAttributeChange(attr.key, date, attr.type)}
                            style={{ marginLeft: -12 }}
                        />
                    </View>
                )
            case CategoryFieldType.boolean:
                return (
                    <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                        <Text style={machineStyles.fieldLabel}>{attr.key}: </Text>
                        <Switch
                            onValueChange={value => handleAttributeChange(attr.key, value, attr.type)}
                            value={Boolean(machineState.attributes.find(a => a.key === attr.key)?.value)}
                        />
                    </View>
                )
        }
    }, [machineState])

    // if (isCollapsed) {
    //     return (
    //         <View style={{
    //             width: `100%`,
    //             backgroundColor: '#2B7EFE11',
    //             borderRadius: 12,
    //             padding: 16,
    //             flexDirection: 'row',
    //             justifyContent: 'space-between'
    //         }}>
    //             <View style={{ gap: 10 }}>
    //                 <Text style={machineStyles.title}>Title: {categoryState.name || ' '}</Text>
    //                 <Text>Number of fields: {categoryState.fields.length}</Text>
    //             </View>
    //             <View style={{ flexDirection: 'row', gap: 4 }}>
    //                 <Button
    //                     style={{ ...machineStyles.iconButton, backgroundColor: 'hotpink' }}
    //                     onPress={() => dispatch(deleteCategory(categoryState.id))}
    //                 >
    //                     Delete
    //                 </Button>
    //                 <Button
    //                     style={{ ...machineStyles.iconButton, backgroundColor: '#2B7EFE' }}
    //                     onPress={() => setCollapsed(false)}
    //                 >
    //                     Edit
    //                 </Button>
    //             </View>
    //         </View>
    //     )
    // }

    return (
        <View style={{
            width: `100%`,
            backgroundColor: '#2B7EFE11',
            borderRadius: 12,
            padding: 16,
            gap: 10
        }}>
            <Text>{String(machineState.attributes.find(attr => selectedCategory.titleField === attr.key)?.value || '')}</Text>
            {
                selectedCategory.fields.map(field => (
                    <View key={field.key} style={{ flexDirection: 'row', columnGap: 4 }}>
                        {
                            getAttributeComponent({ key: field.key, type: field.type, value: '' })
                        }
                    </View>
                ))
            }
        </View>
    )
}


const machineStyles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: '500'
    },
    textInput: {
        backgroundColor: '#FFFFFF',
        height: 40,
        borderRadius: 8,
        paddingHorizontal: 10,
        borderColor: '#2B7EFEcc',
        borderWidth: 1,
    },
    iconButton: {
        backgroundColor: 'hotpink',
        paddingHorizontal: 4,
        paddingVertical: 0,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8
    },
    fieldLabel: {
        textTransform: 'capitalize',
        width: 80
    }

})