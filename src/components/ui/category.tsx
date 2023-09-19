import * as React from 'react'
import { View, Text, StyleSheet, TextInput } from 'react-native'
import { CategoryFieldType, Category as TCategory } from '../../types'
import Divider from './divider'
import Select from './select'
import Button from './button'
import { debounce, generateRandomUUID } from '../../utils'
import { deleteCategory, editCategory } from '../../store/categorySlice'
import { useAppDispatch } from '../../hooks'
import { categoryFieldTypes } from '../../constants'
import Ionicons from '@expo/vector-icons/Ionicons'


export default function Category(props: TCategory) {

    const [categoryState, setCategoryState] = React.useState<TCategory>(props)
    const [isCollapsed, setCollapsed] = React.useState<boolean>(false)
    const [hasSetTitleField, setHasSetTitleField] = React.useState<boolean>(Boolean(props.titleField))
    const dispatch = useAppDispatch()
    const debouncedDispatch = React.useMemo(() => debounce(dispatch, 500), [])


    React.useEffect(() => {
        debouncedDispatch(editCategory(categoryState))
    }, [categoryState])

    const handleFieldChange = React.useCallback((id: string, key: string, value: string) => {
        setCategoryState(oldCategory => {
            const fields = [...oldCategory.fields]
            const index = fields.findIndex(field => field.id === id)

            fields[index] = { ...fields[index], [key]: value }

            if (!hasSetTitleField) {
                return {
                    ...oldCategory,
                    fields,
                    titleField: fields[0].key
                }
            }

            return { ...oldCategory, fields }
        })
    }, [hasSetTitleField])

    const removeField = React.useCallback((id: string) => {
        setCategoryState(oldCategory => {
            const fields = [...oldCategory.fields]
            const index = fields.findIndex(field => field.id === id)
            fields.splice(index, 1)

            return { ...oldCategory, fields }
        })
    }, [])

    const handleTitleFieldChange = React.useCallback((newValue: string) => {
        setHasSetTitleField(true)
        setCategoryState((prevState) => ({ ...prevState, titleField: newValue }))
    }, [])

    if (isCollapsed) {
        return (
            <View style={{
                width: `100%`,
                backgroundColor: '#2d7bf10f',
                borderRadius: 8,
                padding: 12,
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}>
                <View style={{ gap: 8 }}>
                    <Text style={categoryStyles.title}>Title: {categoryState.name || ' '}</Text>
                    <Text>Number of fields: {categoryState.fields.length}</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 4 }}>
                    <Button
                        style={{ ...categoryStyles.iconButton, backgroundColor: 'hotpink' }}
                        onPress={() => dispatch(deleteCategory(categoryState.id))}
                    >
                        <Ionicons name="trash-outline" size={18} color="white" />
                    </Button>
                    <Button
                        style={{ ...categoryStyles.iconButton, backgroundColor: '#2B7EFE' }}
                        onPress={() => setCollapsed(false)}
                    >
                        <Ionicons name="chevron-down" size={18} color="white" />
                    </Button>
                </View>
            </View>
        )
    }

    return (
        <View style={{
            width: `100%`,
            backgroundColor: '#2d7bf10f',
            borderRadius: 8,
            padding: 12,
            gap: 10
        }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text ellipsizeMode='tail' numberOfLines={1} style={categoryStyles.title}>{categoryState.name || ' '}</Text>
                <View style={{ flexDirection: 'row', gap: 4 }}>
                    <Button onPress={() => dispatch(deleteCategory(categoryState.id))} style={{ ...categoryStyles.iconButton, backgroundColor: 'hotpink' }}>
                        <Ionicons name="trash-outline" size={18} color="white" />
                    </Button>
                    <Button onPress={() => setCollapsed(true)} style={{ ...categoryStyles.iconButton, backgroundColor: '#2B7EFE' }}>
                        <Ionicons name="chevron-up" size={18} color="white" />
                    </Button>
                </View>
            </View>

            <Text style={{ marginBottom: -4 }}>Category name:</Text>

            <TextInput
                style={categoryStyles.textInput}
                onChangeText={(text) => setCategoryState({ ...categoryState, name: text })}
                placeholder='Category Name'
                value={categoryState.name}
            />

            <Divider style={{ marginVertical: 0 }} />

            <Text style={{ marginBottom: -4 }}>Fields:</Text>

            {categoryState.fields.map(field => (
                <View key={field.id} style={{ flexDirection: 'row', columnGap: 4 }}>
                    <Select
                        options={categoryFieldTypes}
                        defaultValue={field.type || CategoryFieldType.text}
                        onChange={(newValue) => handleFieldChange(field.id, 'type', newValue)}
                    />
                    <TextInput
                        autoCapitalize='none'
                        style={{ ...categoryStyles.textInput, flex: 2 }}
                        onChangeText={(text) => handleFieldChange(field.id, 'key', text)}
                        placeholder='Field'
                        value={field.key}
                    />
                    <Button style={categoryStyles.iconButton} onPress={() => removeField(field.id)}>
                        <Ionicons name="trash-outline" size={18} color="white" />
                    </Button>
                </View>
            ))}

            <View style={{ flexDirection: 'row' }}>
                <Button
                    onPress={() => setCategoryState({
                        ...categoryState,
                        fields: [
                            ...categoryState.fields,
                            { key: "", type: CategoryFieldType.text, id: generateRandomUUID() }
                        ]
                    })
                    }

                    style={{
                        paddingHorizontal: 12,
                    }}
                >
                    Add New Field
                </Button>
            </View>

            <Divider style={{ marginVertical: 6 }} />

            <Text style={{ marginBottom: -4 }}>Title field:</Text>
            <Select
                onChange={(newValue) => handleTitleFieldChange(newValue)}
                options={categoryState.fields.map(field => field.key)}
                defaultValue={categoryState.titleField}
                buttonStyle={{
                    width: '100%'
                }}
            />

            {/* <Button onPress={async () => {
                const o =  
                console.log(o)
                setScreenOrientation(o)
            }}>{String(screenOrientation)}</Button> */}


        </View>
    )
}

const categoryStyles = StyleSheet.create({
    title: {
        fontSize: 16,
        fontWeight: '500',
        overflow: 'hidden',
        flex: 1,
        flexWrap: 'nowrap',
        paddingRight: 10
    },
    textInput: {
        backgroundColor: '#FFFFFF',
        height: 32,
        borderRadius: 8,
        paddingHorizontal: 10,
        borderColor: '#2B7EFEcc',
        borderWidth: 1,
    },
    iconButton: {
        backgroundColor: 'hotpink',
        paddingHorizontal: 4,
        paddingVertical: 0,
        height: 30,
        width: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8
    }
})