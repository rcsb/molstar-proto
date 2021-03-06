/**
 * Copyright (c) 2018 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 */

import { ComplexRepresentation, StructureRepresentation } from '..';
import { PickingId } from '../../../geometry/picking';
import { Structure } from 'mol-model/structure';
import { Task } from 'mol-task';
import { Loci, isEmptyLoci } from 'mol-model/loci';
import { MarkerAction } from '../../../geometry/marker-data';
import { CarbohydrateSymbolVisual, DefaultCarbohydrateSymbolProps } from '../visual/carbohydrate-symbol-mesh';
import { CarbohydrateLinkVisual, DefaultCarbohydrateLinkProps } from '../visual/carbohydrate-link-cylinder';
import { SizeThemeProps } from 'mol-view/theme/size';
import { getQualityProps } from '../../util';

export const DefaultCarbohydrateProps = {
    ...DefaultCarbohydrateSymbolProps,
    ...DefaultCarbohydrateLinkProps,

    sizeTheme: { name: 'uniform', value: 1, factor: 1 } as SizeThemeProps,
}
export type CarbohydrateProps = typeof DefaultCarbohydrateProps

export type CarbohydrateRepresentation = StructureRepresentation<CarbohydrateProps>

export function CarbohydrateRepresentation(): CarbohydrateRepresentation {
    const carbohydrateSymbolRepr = ComplexRepresentation('Carbohydrate symbol mesh', CarbohydrateSymbolVisual)
    const carbohydrateLinkRepr = ComplexRepresentation('Carbohydrate link cylinder', CarbohydrateLinkVisual)

    let currentProps: CarbohydrateProps
    return {
        label: 'Carbohydrate',
        get renderObjects() {
            return [ ...carbohydrateSymbolRepr.renderObjects, ...carbohydrateLinkRepr.renderObjects ]
        },
        get props() {
            return { ...carbohydrateSymbolRepr.props, ...carbohydrateLinkRepr.props }
        },
        createOrUpdate: (props: Partial<CarbohydrateProps> = {}, structure?: Structure) => {
            const qualityProps = getQualityProps(Object.assign({}, currentProps, props), structure)
            currentProps = Object.assign({}, DefaultCarbohydrateProps, currentProps, props, qualityProps)
            return Task.create('Creating CarbohydrateRepresentation', async ctx => {
                await carbohydrateSymbolRepr.createOrUpdate(currentProps, structure).runInContext(ctx)
                await carbohydrateLinkRepr.createOrUpdate(currentProps, structure).runInContext(ctx)
            })
        },
        getLoci: (pickingId: PickingId) => {
            const carbohydrateSymbolLoci = carbohydrateSymbolRepr.getLoci(pickingId)
            const carbohydrateLinkLoci = carbohydrateLinkRepr.getLoci(pickingId)
            return !isEmptyLoci(carbohydrateSymbolLoci) ? carbohydrateSymbolLoci
                : carbohydrateLinkLoci
        },
        mark: (loci: Loci, action: MarkerAction) => {
            const markSymbol = carbohydrateSymbolRepr.mark(loci, action)
            const markLink = carbohydrateLinkRepr.mark(loci, action)
            return markSymbol || markLink
        },
        destroy() {
            carbohydrateSymbolRepr.destroy()
            carbohydrateLinkRepr.destroy()
        }
    }
}