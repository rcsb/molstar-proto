/**
 * Copyright (c) 2018 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * Adapted from LiteMol
 * Copyright (c) 2016 - now David Sehnal, licensed under Apache 2.0, See LICENSE file for more info.
 *
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 */

import * as React from 'react'

import { View } from '../view';
import { Controller } from '../../controller/controller';
import { Toggle } from '../controls/common';
import { DistanceRestraintEntity } from 'mol-view/state/entity';
import { DistanceRestraintUpdate } from 'mol-view/state/transform'
import { StateContext } from 'mol-view/state/context';
import { ColorThemeProps, ColorThemeNames, ColorThemeName } from 'mol-view/theme/color';
import { SizeThemeProps } from 'mol-view/theme/size';
import { Color, ColorNames } from 'mol-util/color';
import { Slider } from '../controls/slider';
import { Unit } from 'mol-model/structure';
import { VisualQuality } from 'mol-geo/geometry/geometry';

interface BallAndStickState {
    doubleSided: boolean
    flipSided: boolean
    flatShaded: boolean
    colorTheme: ColorThemeProps
    colorValue: Color
    sizeTheme: SizeThemeProps
    visible: boolean
    alpha: number
    depthMask: boolean
    useFog: boolean
    quality: VisualQuality
    linkScale: number
    linkSpacing: number
    linkRadius: number
    radialSegments: number
    detail: number
    unitKinds: Unit.Kind[]
}

export class BallAndStick extends View<Controller<any>, BallAndStickState, { transform: DistanceRestraintUpdate, entity: DistanceRestraintEntity, ctx: StateContext }> {
    state = {
        doubleSided: true,
        flipSided: false,
        flatShaded: false,
        colorTheme: { name: 'element-symbol' } as ColorThemeProps,
        colorValue: Color(0x000000),
        sizeTheme: { name: 'uniform', value: 0.15 } as SizeThemeProps,
        visible: true,
        alpha: 1,
        depthMask: true,
        useFog: true,
        quality: 'auto' as VisualQuality,
        linkScale: 0.4,
        linkSpacing: 1,
        linkRadius: 0.25,
        radialSegments: 16,
        detail: 1,
        unitKinds: [] as Unit.Kind[]
    }

    componentWillMount() {
        this.setState({ ...this.state, ...this.props.entity.value.props })
    }

    update(state?: Partial<BallAndStickState>) {
        const { transform, entity, ctx } = this.props
        const newState = { ...this.state, ...state }
        this.setState(newState)
        transform.apply(ctx, entity, newState)
    }

    render() {
        const { transform } = this.props

        const qualityOptions = ['auto', 'custom', 'highest', 'high', 'medium', 'low', 'lowest'].map((name, idx) => {
            return <option key={name} value={name}>{name}</option>
        })

        const colorThemeOptions = ColorThemeNames.map((name, idx) => {
            return <option key={name} value={name}>{name}</option>
        })

        const colorValueOptions = Object.keys(ColorNames).map((name, idx) => {
            return <option key={name} value={(ColorNames as any)[name]}>{name}</option>
        })

        return <div className='molstar-transformer-wrapper'>
            <div className='molstar-panel molstar-control molstar-transformer molstar-panel-expanded'>
                <div className='molstar-panel-header'>
                    <button
                        className='molstar-btn molstar-btn-link molstar-panel-expander'
                        onClick={() => this.update()}
                    >
                        <span>[{transform.kind}] {transform.inputKind} -> {transform.outputKind}</span>
                    </button>
                </div>
                <div className='molstar-panel-body'>
                    <div>
                        <div className='molstar-control-row molstar-options-group'>
                            <span>Quality</span>
                            <div>
                                <select
                                    className='molstar-form-control'
                                    value={this.state.quality}
                                    onChange={(e) => this.update({ quality: e.target.value as VisualQuality })}
                                >
                                    {qualityOptions}
                                </select>
                            </div>
                        </div>
                        <div className='molstar-control-row molstar-options-group'>
                            <span>Color theme</span>
                            <div>
                                <select
                                    className='molstar-form-control'
                                    value={this.state.colorTheme.name}
                                    onChange={(e) => {
                                        this.update({
                                            colorTheme: {
                                                name: e.target.value as ColorThemeName,
                                                value: this.state.colorValue
                                            }
                                        })
                                    }}
                                >
                                    {colorThemeOptions}
                                </select>
                            </div>
                        </div>
                        <div className='molstar-control-row molstar-options-group'>
                            <span>Color value</span>
                            <div>
                                <select
                                    className='molstar-form-control'
                                    value={this.state.colorValue}
                                    onChange={(e) => {
                                        const colorValue = Color(parseInt(e.target.value))
                                        this.update({
                                            colorTheme: {
                                                name: 'uniform',
                                                value: colorValue
                                            },
                                            colorValue
                                        })
                                    }}
                                >
                                    {colorValueOptions}
                                </select>
                            </div>
                        </div>
                        <div className='molstar-control-row molstar-options-group'>
                            <div>
                                <Toggle
                                    value={this.state.visible}
                                    label='Visibility'
                                    onChange={value => this.update({ visible: value })}
                                />
                            </div>
                        </div>
                        <div className='molstar-control-row molstar-options-group'>
                            <div>
                                <Toggle
                                    value={this.state.depthMask}
                                    label='Depth write'
                                    onChange={value => this.update({ depthMask: value })}
                                />
                            </div>
                        </div>
                        <div className='molstar-control-row molstar-options-group'>
                            <div>
                                <Toggle
                                    value={this.state.doubleSided}
                                    label='Double sided'
                                    onChange={value => this.update({ doubleSided: value })}
                                />
                            </div>
                        </div>
                        <div className='molstar-control-row molstar-options-group'>
                            <div>
                                <Toggle
                                    value={this.state.flipSided}
                                    label='Flip sided'
                                    onChange={value => this.update({ flipSided: value })}
                                />
                            </div>
                        </div>
                        <div className='molstar-control-row molstar-options-group'>
                            <div>
                                <Toggle
                                    value={this.state.flatShaded}
                                    label='Flat shaded'
                                    onChange={value => this.update({ flatShaded: value })}
                                />
                            </div>
                        </div>
                        <div className='molstar-control-row molstar-options-group'>
                            <div>
                                <Slider
                                    value={this.state.alpha}
                                    label='Opacity'
                                    min={0}
                                    max={1}
                                    step={0.01}
                                    callOnChangeWhileSliding={true}
                                    onChange={value => this.update({ alpha: value })}
                                />
                            </div>
                        </div>
                        <div className='molstar-control-row molstar-options-group'>
                            <div>
                                <Slider
                                    value={this.state.sizeTheme.factor || 1}
                                    label='Size factor'
                                    min={0.1}
                                    max={3}
                                    step={0.01}
                                    callOnChangeWhileSliding={true}
                                    onChange={value => this.update({
                                        sizeTheme: { ...this.state.sizeTheme, factor: value }
                                    })}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>;
    }
}