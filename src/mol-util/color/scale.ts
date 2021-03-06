/**
 * Copyright (c) 2018 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 */

import { Color } from './color'
import { ColorBrewer } from './tables'
import { ScaleLegend } from 'mol-view/theme/color';
import { defaults } from 'mol-util';

export interface ColorScale {
    /** Returns hex color for given value */
    color: (value: number) => Color
    /** Copies color to rgb int8 array */
    colorToArray: (value: number, array: Helpers.NumberArray, offset: number) => void
    /** Copies normalized (0 to 1) hex color to rgb array */
    normalizedColorToArray: (value: number, array: Helpers.NumberArray, offset: number) => void
    /**  */
    setDomain: (min: number, max: number) => void
    /** Legend */
    readonly legend: ScaleLegend
}

export const DefaultColorScale = {
    domain: [0, 1],
    reverse: false,
    colors: ColorBrewer.RdYlBu,
    minLabel: '' as string | undefined,
    maxLabel: '' as string | undefined,
}
export type ColorScaleProps = Partial<typeof DefaultColorScale>

export namespace ColorScale {
    export function create(props: ColorScaleProps): ColorScale {
        const { domain, reverse, colors: _colors } = { ...DefaultColorScale, ...props }
        const colors = reverse ? _colors.slice().reverse() : _colors
        const count1 = colors.length - 1

        let diff = 0, min = 0, max = 0
        function setDomain(_min: number, _max: number) {
            min = _min
            max = _max
            diff = (max - min) || 1
        }
        setDomain(domain[0], domain[1])

        const minLabel = defaults(props.minLabel, min.toString())
        const maxLabel = defaults(props.maxLabel, max.toString())

        function color(value: number) {
            const t = Math.min(colors.length - 1, Math.max(0, ((value - min) / diff) * count1))
            const tf = Math.floor(t)
            const c1 = colors[tf]
            const c2 = colors[Math.ceil(t)]
            return Color.interpolate(c1, c2, t - tf)
        }
        return {
            color,
            colorToArray: (value: number, array: Helpers.NumberArray, offset: number) => {
                Color.toArray(color(value), array, offset)
            },
            normalizedColorToArray: (value: number, array: Helpers.NumberArray, offset: number) => {
                Color.toArrayNormalized(color(value), array, offset)
            },
            setDomain,
            get legend() { return ScaleLegend(minLabel, maxLabel, colors) }
        }
    }
}
