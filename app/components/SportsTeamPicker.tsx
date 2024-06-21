import { ApplicationSettings, Screen } from '@nativescript/core'
import * as React from 'react'
import { Sport, Team } from '~/generated/graphql'
import Methods from '~/Methods'
import Theme, { Theme2 } from '~/Theme'
import Modal, { ModalExpandableBody, ModalProps } from '~/ui/Modal'

import { AppAuthContext } from './Root'

export type SportTeamPickerViewResponse = {
  sports: SportTeamPickerInputItem[],
  teams: SportTeamPickerInputItem[],
}
interface SportTeamPickerView {
  title: string,
  render(): React.ReactNode,
}

interface SportTeamPickerProps extends Pick<ModalProps, 'renderTriggerAction'> {
  open?: boolean
  onApply?(data: SportTeamPickerViewResponse): void
}
export const SportTeamPicker = ({ renderTriggerAction, onApply }: SportTeamPickerProps) => {
  const { user } = React.useContext(AppAuthContext)
  const { heightDIPs } = Screen.mainScreen
  const allSports: Sport[] = JSON.parse(ApplicationSettings.getString('sports', '[]'))
  const allTeams: Team[] = JSON.parse(ApplicationSettings.getString('teams', '[]'))
  const [step, setStep] = React.useState(0)
  const [selectedSports, setSelectedSports] = React.useState<SportTeamPickerInputItem[]>(() => {
    return user.sportsFollowed.map((c) => ({
      id: c.id,
      image: `https://supotsu.com/${c.image.replace("_wht", "").replace('.svg', '.png')}`,
      name: c.name,
      selected: true
    }))
  })

  const [selectedTeams, setSelectedTeams] = React.useState<SportTeamPickerInputItem[]>(() => {
    return user.teamsFollowed.map((c) => ({
      id: Methods.getUser(c)._id,
      image: `https://supotsu.com/${Methods.getUser(c).image.replace("_wht", "").replace('.svg', '.png')}`,
      name: Methods.getUser(c).name,
      selected: true
    }))
  })
  const views: SportTeamPickerView[] = [
    {
      title: 'Select Sports (1/2)',
      render() {
        return (
          <gridLayout height={heightDIPs * 0.6}>
            <SportTeamPickerInput onSelectedChange={(items) => setSelectedSports(items)} selected={selectedSports} items={allSports.map((c) => ({
              id: c._id,
              image: `https://supotsu.com/${c.image.replace("_wht", "").replace('.svg', '.png')}`,
              name: c.name
            }))} />
          </gridLayout>
        )
      },
    },
    {
      title: 'Select Teams (2/2)',
      render() {
        return (
          <gridLayout height={heightDIPs * 0.6}>
            <SportTeamPickerInput onSelectedChange={(items) => setSelectedTeams(items)} selected={selectedTeams} items={allTeams.map((c) => ({
              id: c._id,
              image: `https://supotsu.com/${c.image.replace("_wht", "_drk").replace('.svg', '.png')}`,
              name: c.name
            }))} />
          </gridLayout>
        )
      },
    }
  ]
  const currentView = views[step]
  const onNext = (close = () => { }) => {
    const nextStep = step + 1;
    if (nextStep === views.length) {
      // save
      if (onApply) {
        onApply({
          sports: selectedSports,
          teams: selectedTeams
        })
      }
      close()
    } else {
      setStep((step) => step + 1)
    }
  }

  return (
    <Modal
      fullscreen
      renderTriggerAction={renderTriggerAction}
      renderContent={(open, close) => {
        if (!currentView) return <></>
        return (
          <gridLayout width={'100%'} height='100%' background='transparent'>
            <ModalExpandableBody onConfirm={() => {
              onNext(close)
            }} okText={step === views.length - 1 ? 'Apply' : 'Next'} cancelText={step > 0 ? 'Back' : 'Cancel'} onClose={(confirmed) => {
              if (confirmed) return
              if (step > 0) {
                setStep(step - 1)
              } else {
                close()
              }
            }} title={currentView.title} message=''>
              {currentView.render()}
            </ModalExpandableBody>
          </gridLayout>
        )
      }}
    />
  )
}


export type SportTeamPickerInputItem = {
  id: string
  image: string
  name: string,
  selected?: boolean
}
interface SportTeamPickerInputProps {
  selected: SportTeamPickerInputItem[],
  items: SportTeamPickerInputItem[],
  onSelectedChange?(items: SportTeamPickerInputItem[]): void
}
const SportTeamPickerInput = ({
  items,
  selected,
  onSelectedChange
}: SportTeamPickerInputProps) => {
  const [values, setValues] = React.useState(() => selected)
  const selectedIds = values.map((c) => c.id)
  const freeList = items.filter((c) => !selectedIds.includes(c.id))
  const listItems = [...values.map((item) => ({
    ...item,
    selected: true
  })), ...freeList]

  // const chunks: SportTeamPickerInputItem[][] = Methods.arrayChunks(listItems, 2)
  return (
    <gridLayout rows='auto, *'>
      <scrollView row={1}>
        <flexboxLayout flexWrap='wrap'>
          {listItems.map((item) => {
            const onSelected = () => {
              const newSelected = selectedIds.includes(item.id) ? values.filter((i) => i.id !== item.id) : [...values, item]
              setValues(newSelected)
              if (onSelectedChange) {
                onSelectedChange(newSelected)
              }
            }
            return (
              <gridLayout rows='100, auto' key={item.id} style={{
                width: 100,
                marginRight: 17,
                marginBottom: 17,
              }} onTap={() => onSelected()}>
                <flexboxLayout alignItems='center' justifyContent='center' key={item.id} style={{
                  height: 80,
                  width: 80,
                  borderRadius: '50%',
                  background: Theme2[100],
                  padding: 12,
                  borderColor: item.selected ? Theme2[500] : Theme2[100],
                  borderWidth: 5,
                }} onTap={() => onSelected()}>
                  <image width={80} height={80} borderRadius='50%' src={`${item.image}`} />
                </flexboxLayout>
                <label row={1} textAlignment='center' textWrap text={item.name} style={{
                  marginTop: 8,
                }} />
              </gridLayout>
            )
          })}
        </flexboxLayout>
      </scrollView>
    </gridLayout>
  )
}
