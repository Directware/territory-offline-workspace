import {PrintConfiguration} from './print-configuration.model';
import {TimedEntity} from '../../../model/db/timed-entity.interface';
import {FeatureCollection, Geometry} from '@turf/turf';

export interface Drawing extends TimedEntity
{
  featureCollection: FeatureCollection<Geometry>;
  printConfiguration?: PrintConfiguration;
}
